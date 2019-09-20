#!/usr/bin/env bash

git clone https://github.com/navikt/sosialhjelp-ci.git
VERSION=$(create-artifact-version.sh)
echo "VERSION=$VERSION"