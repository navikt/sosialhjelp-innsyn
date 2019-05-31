FROM node as node-builder
ADD / /source
WORKDIR /source
RUN npm ci && npm run build

FROM navikt/pus-decorator:216.20190522.1711
ENV APPLICATION_NAME=sosialhjelp-innsyn
ENV HEADER_TYPE=WITH_MENU
ENV FOOTER_TYPE=WITHOUT_ALPHABET
COPY --from=node-builder /source/build /app


ENV CONTEXT_PATH=/