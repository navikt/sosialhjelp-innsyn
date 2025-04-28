FROM gcr.io/distroless/nodejs22-debian11 AS runtime

WORKDIR /app

COPY package.json /app/
COPY next-logger.config.js /app/
COPY .env /app/
COPY .env.production /app/
COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

CMD ["server.js"]
