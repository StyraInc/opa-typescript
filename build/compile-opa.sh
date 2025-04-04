#!/usr/bin/env bash

set -eo pipefail
exit 0

pushd ../../
npm install # 'npm ci' fails with engine mismatch in SE workflow run
npm run build --workspaces
