#!/usr/bin/env bash

set -Eeuo pipefail

readonly APP_NAME="akash-portfolio"
readonly SOURCE_REPOSITORY="/home/akash/akash-portfolio"
readonly DEPLOY_BRANCH="publish-portfolio"
readonly DEPLOY_SCRIPT="${SOURCE_REPOSITORY}/scripts/deploy-production.sh"

remote_sha="$(git -C "${SOURCE_REPOSITORY}" ls-remote origin "refs/heads/${DEPLOY_BRANCH}" | awk '{print $1}')"
if [[ ! "${remote_sha}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Could not resolve origin/${DEPLOY_BRANCH}." >&2
  exit 1
fi

deployed_sha=""
production_pid="$(pm2 pid "${APP_NAME}" 2>/dev/null || true)"
if [[ "${production_pid}" =~ ^[0-9]+$ ]] && (( production_pid > 0 )); then
  production_directory="$(readlink -f "/proc/${production_pid}/cwd" 2>/dev/null || true)"
  if [[ -f "${production_directory}/RELEASE" ]]; then
    deployed_sha="$(awk -F= '$1 == "commit" { print $2; exit }' "${production_directory}/RELEASE")"
  fi
fi

if [[ "${deployed_sha}" == "${remote_sha}" ]]; then
  echo "Portfolio production is already at ${remote_sha}."
  exit 0
fi

echo "Deploying origin/${DEPLOY_BRANCH}: ${deployed_sha:-none} -> ${remote_sha}."
exec "${DEPLOY_SCRIPT}" "${remote_sha}"

