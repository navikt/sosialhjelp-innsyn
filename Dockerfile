FROM docker.pkg.github.com/navikt/pus-decorator/pus-decorator
ENV APPLICATION_NAME=sosialhjelp-innsyn
ENV HEADER_TYPE=WITH_MENU
ENV FOOTER_TYPE=WITHOUT_ALPHABET
ENV DISABLE_UNLEASH=true
ENV CONTEXT_PATH=/sosialhjelp/innsyn/
COPY /build /app
