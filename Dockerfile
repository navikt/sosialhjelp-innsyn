WORKDIR /
RUN npm ci && npm run build

FROM docker.adeo.no:5000/pus/decorator
ENV APPLICATION_NAME=sosialhjelp-innsyn

COPY --from=builder /build /app

ADD decorator.yaml /decorator.yaml