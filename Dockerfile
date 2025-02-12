FROM node:20@sha256:fd0115473b293460df5b217ea73ff216928f2b0bb7650c5e7aa56aae4c028426 as runtime

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

CMD [ "node", "server.js" ]
