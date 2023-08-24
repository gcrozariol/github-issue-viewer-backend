FROM node:18-alpine as base

WORKDIR /app
COPY package*.json /
EXPOSE 3333

FROM base as dev
ENV NODE_ENV=dev
RUN npm i
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]

FROM base as production
ENV NODE_ENV=production
RUN npm ci --only-production
COPY --from=dev /app/dist ./dist
CMD ["node", "dist/server.js"]