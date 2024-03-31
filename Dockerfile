# build environment
FROM node:21-alpine as build

USER node

WORKDIR /app
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

RUN npm ci --silent

COPY --chown=node:node . ./

RUN npm run build

# production environment
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY gzip.conf /etc/nginx/conf.d/gzip.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .

COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && /bin/bash -c "/usr/share/nginx/html/env.sh" && nginx -g 'daemon off;'