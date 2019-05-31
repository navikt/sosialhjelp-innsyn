FROM node as node-builder
ADD / /source
WORKDIR /source
RUN npm ci && npm run build

FROM navikt/pus-decorator
ENV APPLICATION_NAME=sosialhjelp-innsyn

COPY --from=node-builder /source/build /app

ADD decorator.yaml /decorator.yaml