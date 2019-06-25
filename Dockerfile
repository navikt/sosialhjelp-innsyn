FROM node as node-builder
ADD / /source
WORKDIR /source
RUN npm ci && npm run build

FROM navikt/pus-decorator
ENV APPLICATION_NAME=sosialhjelp-innsyn
ENV HEADER_TYPE=WITH_MENU
ENV FOOTER_TYPE=WITHOUT_ALPHABET
ENV CONTEXT_PATH=/soknadsosialhjelp/innsyn/
COPY --from=node-builder /source/build /app
