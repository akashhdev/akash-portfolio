#!/usr/bin/env bash

set -Eeuo pipefail

umask 022

readonly APP_NAME="akash-portfolio"
readonly SOURCE_REPOSITORY="/home/akash/akash-portfolio"
readonly RELEASES_DIRECTORY="/home/akash/releases"
readonly BUILDS_DIRECTORY="/home/akash/builds"
readonly DEPLOY_BRANCH="publish-portfolio"
readonly SITE_URL="https://akash.tw"
readonly PRODUCTION_PORT="3003"
readonly PREFLIGHT_PORT="3103"
readonly LOCK_FILE="/home/akash/.akash-portfolio-deploy.lock"

requested_sha="${1:-${GITHUB_SHA:-}}"

if [[ ! "${requested_sha}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Usage: $0 <40-character commit SHA>" >&2
  exit 2
fi

exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "Another portfolio deployment is already running." >&2
  exit 1
fi

mkdir -p "${RELEASES_DIRECTORY}" "${BUILDS_DIRECTORY}"

git -C "${SOURCE_REPOSITORY}" fetch --quiet origin "${DEPLOY_BRANCH}"
remote_sha="$(git -C "${SOURCE_REPOSITORY}" rev-parse FETCH_HEAD)"
if [[ "${requested_sha}" != "${remote_sha}" ]]; then
  echo "Refusing to deploy ${requested_sha}: origin/${DEPLOY_BRANCH} is ${remote_sha}." >&2
  exit 1
fi

timestamp="$(date -u +%Y%m%d-%H%M%S)"
short_sha="${requested_sha:0:7}"
build_directory="${BUILDS_DIRECTORY}/portfolio-${timestamp}-${short_sha}"
release_directory="${RELEASES_DIRECTORY}/portfolio-${timestamp}-${short_sha}"
preflight_pid=""

cleanup() {
  if [[ -n "${preflight_pid}" ]] && kill -0 "${preflight_pid}" 2>/dev/null; then
    kill "${preflight_pid}" 2>/dev/null || true
    wait "${preflight_pid}" 2>/dev/null || true
  fi

  if [[ -d "${build_directory}" ]]; then
    git -C "${SOURCE_REPOSITORY}" worktree remove --force "${build_directory}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

git -C "${SOURCE_REPOSITORY}" worktree add --quiet --detach "${build_directory}" "${requested_sha}"

(
  cd "${build_directory}"
  npm ci
  npm test
  NEXT_PUBLIC_SITE_URL="${SITE_URL}" npm run build
)

test -f "${build_directory}/.next/standalone/server.js"
test -d "${build_directory}/.next/static"
test -d "${build_directory}/public"

mkdir -p "${release_directory}/.next/static"
cp -a "${build_directory}/.next/standalone/." "${release_directory}/"
cp -a "${build_directory}/.next/static/." "${release_directory}/.next/static/"
cp -a "${build_directory}/public" "${release_directory}/public"

{
  printf 'commit=%s\n' "${requested_sha}"
  printf 'deployed_at=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%S+00:00)"
  printf 'branch=%s\n' "${DEPLOY_BRANCH}"
} > "${release_directory}/RELEASE"

if ! rg -q "Project context" "${release_directory}/.next/static"; then
  echo "Release does not contain the expected project-detail client bundle." >&2
  exit 1
fi

(
  cd "${release_directory}"
  HOSTNAME=127.0.0.1 PORT="${PREFLIGHT_PORT}" NEXT_PUBLIC_SITE_URL="${SITE_URL}" node server.js
) > "${release_directory}/preflight.log" 2>&1 &
preflight_pid="$!"

preflight_ready=false
for _ in {1..30}; do
  if curl --fail --silent "http://127.0.0.1:${PREFLIGHT_PORT}/health" >/dev/null; then
    preflight_ready=true
    break
  fi
  sleep 1
done

if [[ "${preflight_ready}" != true ]]; then
  echo "Preflight server did not become healthy." >&2
  tail -n 100 "${release_directory}/preflight.log" >&2 || true
  exit 1
fi

for route in \
  "/projects" \
  "/projects?project=arcgis-shapefiles-to-3d-models" \
  "/projects?project=image-color-restoration" \
  "/projects?project=gesture-cursor-and-keyboard"; do
  curl --fail --silent "http://127.0.0.1:${PREFLIGHT_PORT}${route}" >/dev/null
done

kill "${preflight_pid}"
wait "${preflight_pid}" 2>/dev/null || true
preflight_pid=""

previous_directory=""
previous_pid="$(pm2 pid "${APP_NAME}" 2>/dev/null || true)"
if [[ "${previous_pid}" =~ ^[0-9]+$ ]] && (( previous_pid > 0 )); then
  previous_directory="$(readlink -f "/proc/${previous_pid}/cwd" 2>/dev/null || true)"
fi

pm2_start_release() {
  local directory="$1"
  local deploy_user
  deploy_user="$(id -un)"

  (
    cd "${directory}"
    env -i \
      HOME="${HOME}" \
      USER="${deploy_user}" \
      LOGNAME="${deploy_user}" \
      PATH="${PATH}" \
      PM2_HOME="${PM2_HOME:-${HOME}/.pm2}" \
      HOSTNAME=127.0.0.1 \
      PORT="${PRODUCTION_PORT}" \
      NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
      pm2 start server.js --name "${APP_NAME}" --time
  )
}

wait_for_production() {
  for _ in {1..30}; do
    if curl --fail --silent "http://127.0.0.1:${PRODUCTION_PORT}/health" >/dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}

verify_local_routes() {
  local route
  for route in "/health" "/projects" "/writing"; do
    curl --fail --silent "http://127.0.0.1:8083${route}" >/dev/null || return 1
  done
}

if [[ -n "${previous_directory}" ]]; then
  pm2 delete "${APP_NAME}"
fi

if ! pm2_start_release "${release_directory}" || ! wait_for_production || ! verify_local_routes; then
  echo "New release failed after the PM2 switch; attempting rollback." >&2
  pm2 delete "${APP_NAME}" >/dev/null 2>&1 || true

  if [[ -n "${previous_directory}" && -f "${previous_directory}/server.js" ]]; then
    pm2_start_release "${previous_directory}"
    wait_for_production
    pm2 save
    echo "Rollback restored ${previous_directory}." >&2
  else
    echo "No previous release was available for rollback." >&2
  fi
  exit 1
fi

pm2 save

echo "Deployed ${requested_sha} to ${release_directory}."
if [[ -n "${previous_directory}" ]]; then
  echo "Previous release retained at ${previous_directory}."
fi
