FROM node:14-alpine AS base
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

FROM base AS build-setup
RUN apk add --no-cache git bash autoconf automake libtool binutils gcc g++ make python

FROM build-setup AS build
ARG NODE_AUTH_TOKEN
USER node
COPY --chown=node:node . .
RUN mv dev.js index.js
RUN npm i --package-lock-only && npm ci --no-optional --production && cd test && npm i
# RUN node index.js bundle --webpack-mode production --bundle-mode production

FROM base AS release
COPY --from=build --chown=node:node /home/node/app ./
EXPOSE 10443
ENV NODE_ENV=production
CMD [ "node", "index"]
