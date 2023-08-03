FROM gcr.io/distroless/nodejs:18 as runtime

WORKDIR /app

COPY package.json /app/
COPY next-logger.config.js /app/
COPY sentry.*.config.ts /app/
COPY generated /app/
COPY .env.production /app/
COPY .env /app/
COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 3000

ENV NODE_ENV=production
#ENV NODE_OPTIONS '-r next-logger'

CMD ["server.js"]
