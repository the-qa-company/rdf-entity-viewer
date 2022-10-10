#!/bin/bash

# This script is used to restore the backup of
# package.json after publishing

# Check if backup exists
if [ ! -f package.json.bak ]; then
  echo "Backup file not found"
  exit 1
fi

# Restore backup
mv package.json.bak package.json

