#!/bin/bash
# Denne filen må ha LF som line separator.

# Stop scriptet om en kommando feiler
set -e

# Usage string
usage="Script som bygger prosjektet og deployer på Heroku

Bruk:
./$(basename "$0") OPTIONS

Gyldige OPTIONS:
    -h  | --help        - printer denne hjelpeteksten
"

# Default verdier
PROJECT_ROOT="$( cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_NAME=""
APP_JAR=""

# Hent ut argumenter
for arg in "$@"
do
case $arg in
    -h|--help)
    echo "$usage" >&2
    exit 1
    ;;
    -a=*|--app-name=*)
    APP_NAME="${arg#*=}"
    shift
    ;;
    *) # ukjent argument
    printf "Ukjent argument: %s\n" "$1" >&2
    echo ""
    echo "$usage" >&2
    exit 1
    ;;
esac
done

function get_heroku_app_name {
    # FIXME: Don't die if app name cannot be set from repo or arguments
    heroku_repo=$(git remote get-url heroku)
    APP_NAME=$(echo -n $heroku_repo | sed -E 's#^.*/(.*)\.git$#\1#')
}

function find_app_jar {
    APP_JAR=$(find build/libs/ -name "sosialhjelp-innsyn-api-*.jar")
}

function build_project {
    ./gradlew clean build -x test
}

function deploy_to_heroku {
    # Prerequisites:
    # - heroku plugins:install java
    heroku deploy:jar "$APP_JAR" -a $APP_NAME
}

if [ -z "$APP_NAME" ]; then
    get_heroku_app_name
fi

echo "Build and deploy on $APP_NAME"

build_project
find_app_jar
deploy_to_heroku
