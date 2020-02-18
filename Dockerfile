FROM node:12-alpine AS base
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
COPY package.json .
COPY package-lock.json .

FROM base AS build
RUN apk add --no-cache git bash autoconf automake libtool binutils gcc g++ make python
USER node
WORKDIR /home/node/app
RUN npm ci --no-optional --production
RUN sed -i 1d /home/node/app/node_modules/raml2obj/index.js
RUN node dev.js bundle --webpack-mode production --bundle-mode production

FROM base AS release
COPY --from=build /home/node/app/node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/app/.cache ./.cache
EXPOSE 10443
CMD [ "node", "docker", "--bundle-mode", "production"]
