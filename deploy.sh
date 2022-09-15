#!/bin/bash

BRANCH=$(git symbolic-ref --short HEAD)
if [ $# -eq 1 ]; then
    BRANCH=${1}
fi

printf "Deploying latest commit from branch ${BRANCH}\n"


HASH=$(git rev-parse --short -b $BRANCH)

git fetch --all --tags --quiet

GIT_TAG=$(git tag --contains $HASH | grep $HASH)

sed -i '' "s/{{TAG}}/$GIT_TAG/" compose.yml

## ssh
# docker compose

sed -i '' "s/$GIT_TAG/{{TAG}}/" compose.yml
