FROM gcr.io/distroless/nodejs:18 as runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

COPY package.json /app/
COPY next-logger.config.js /app/
COPY sentry.*.config.ts /app/
COPY generated /app/
COPY .env /app/
COPY .env.production /app/
COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 8080


#ENV NODE_OPTIONS '-r next-logger'
USER node

CMD ["node","server.js"]
