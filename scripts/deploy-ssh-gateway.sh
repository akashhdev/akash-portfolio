#!/usr/bin/env bash

set -Eeuo pipefail

readonly DEPLOY_SCRIPT="/home/akash/akash-portfolio/scripts/deploy-production.sh"

if [[ "${SSH_ORIGINAL_COMMAND:-}" =~ ^deploy[[:space:]]([0-9a-f]{40})$ ]]; then
  exec "${DEPLOY_SCRIPT}" "${BASH_REMATCH[1]}"
fi

echo "This key is restricted to portfolio deployments." >&2
exit 1

