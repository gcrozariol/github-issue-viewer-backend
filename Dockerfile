FROM node:18-alpine as base

WORKDIR /
COPY package*.json /
EXPOSE 3333

FROM base as dev
ENV NODE_ENV=dev
RUN npm i
COPY . /
CMD ["npm", "run", "start:dev"]

FROM base as production
RUN npm ci
COPY . /
ENV NODE_ENV=production
RUN npm run build
RUN npm prune --production
CMD ["node", "dist/server.js"]