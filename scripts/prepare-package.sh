#!/bin/bash

# This script is used to backup package.json file
# and modify it so that it can be used to publish

# Backup package.json
cp package.json package.json.bak

# Edit package.json
npx json -I -f package.json -e "this.devDependencies = {}; this.scripts = {};"
