#!/usr/bin/env bash

# Bygg app og start en server. Brukes for å teste IE 11, som ikke fungerer med den vanlige utviklingsservern
#
# Bruk: ./scripts/statisk_server.sh
#
# Tips: For å få webserver til å restarte ved endring av filer:
# $ sudo gem install filewatcher
# $ filewatcher -r  '**/*.less **/*.ts*' './scripts/statisk_server.sh'

npm run build
cd build
mkdir -p "sosialhjelp/innsyn/static/css/"
mkdir -p "sosialhjelp/innsyn/static/js/"
cp static/css/* sosialhjelp/innsyn/static/css/.
cp static/js/* sosialhjelp/innsyn/static/js/.
npx serve
