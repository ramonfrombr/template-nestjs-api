FROM node:18.17.1-alpine3.18 AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN yarn install
COPY . /usr/src/app/
RUN yarn build

FROM node:18.17.1-alpine3.18 AS production
RUN adduser -u 5000 -D -H app_user
USER app_user
WORKDIR /app
COPY --chown=app_user:app_user --from=build /usr/src/app/dist /app/dist
COPY --chown=app_user:app_user --from=build /usr/src/app/node_modules /app/node_modules
ENV NODE_ENV="production"
ENV TZ="America/Sao_Paulo"
ENV SERVER_HTTP_PORT=3000
ENV SERVER_TCP_PORT=9090
EXPOSE ${SERVER_HTTP_PORT}
EXPOSE ${SERVER_TCP_PORT}
CMD ["node", "dist/main.js"]
