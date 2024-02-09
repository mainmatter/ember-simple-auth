#!/bin/bash
# JSDOC generates documentation in a nested way i.e. /api/ember-simple-auth/6.0.0
# We need to contents to live directly under /api

# Find the path of this script, so we can run it from anywhere
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
pushd $SCRIPT_PATH

COPY_FROM='../gh-pages/api/ember-simple-auth/*'
COPY_TO=../gh-pages/api/

version_dir="$(find $COPY_FROM  -maxdepth 0 -name '*.*')"

cp -r $version_dir/* $COPY_TO;

echo $version_dir;

popd;
