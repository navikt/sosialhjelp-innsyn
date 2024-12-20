FROM gcr.io/distroless/nodejs20-debian11 AS runtime

WORKDIR /app

COPY package.json /app/
COPY next-logger.config.js /app/
COPY sentry.*.config.ts /app/
COPY .env /app/
COPY .env.production /app/
COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
#ENV NODE_OPTIONS '-r next-logger'

CMD ["server.js"]
