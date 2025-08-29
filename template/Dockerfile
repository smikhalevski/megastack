FROM node:23-alpine3.22 AS base

WORKDIR /app/

COPY ./package-lock.json ./package.json ./

RUN npm ci --omit dev

FROM alpine:3.22.1

RUN apk add --no-cache libstdc++

COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY --from=base /app /app
COPY ./build/ app/

ENTRYPOINT ["node", "/app/server.js"]
EXPOSE 3000
