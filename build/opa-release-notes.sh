#!/bin/bash

# This takes the last block (by record separator "\n## ") and removes the first line (timestamp)
awk 'BEGIN { RS="\n## "} END { print $0 }' packages/opa/RELEASES.md | \
  tail +2

envsubst '$VERSION' <<EOF
- [NPM ${VERSION}](https://www.npmjs.com/package/@styra/opa/v/${VERSION})"
EOF
