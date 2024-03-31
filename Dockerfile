# build environment
FROM node:21-alpine as build
WORKDIR /app
USER node
ENV PATH /app/node_modules/.bin:$PATH
COPY --chown=node:node . ./
RUN npm ci --silent
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'