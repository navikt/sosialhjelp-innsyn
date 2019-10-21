#!/usr/bin/env bash

# Run `heroku labs:enable runtime-dyno-metadata -a $APP_NAME` to make $HEROKU_APP_NAME available
if [[ -n "$HEROKU_APP_NAME" && "$HEROKU_APP_NAME" != "sosialhjelp-innsyn" ]]; then
    sed -i 's!sosialhjelp/innsyn!'$HEROKU_APP_NAME'/sosialhjelp/innsyn!g' index.html
fi
