FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 3333

FROM base as production
ENV NODE_ENV=production
RUN npm ci && npm run build
COPY . /
CMD ["npm", "run", "start"]

FROM base as dev
ENV NODE_ENV=dev
RUN npm i
COPY . /
CMD ["npm", "run", "start:dev"]