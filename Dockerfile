WORKDIR /
#RUN npm ci && npm run build

FROM navikt/pus-decorator
ENV APPLICATION_NAME=sosialhjelp-innsyn

COPY --from=builder /build /app

ADD decorator.yaml /decorator.yaml