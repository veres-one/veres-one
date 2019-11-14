FROM node:12-alpine AS base
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package.json .
COPY package-lock.json .

FROM base AS build
RUN apk add --no-cache git bash autoconf automake libtool binutils gcc g++ make python
USER node
WORKDIR /home/node/app
RUN npm ci --no-optional --production

FROM base AS release
COPY --chown=node:node . .
COPY --from=build /home/node/app/node_modules ./node_modules
WORKDIR /home/node/app
EXPOSE 10443
CMD [ "node", "docker" ]
