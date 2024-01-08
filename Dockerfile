FROM node:21-alpine as base

WORKDIR /app
COPY package.json /
COPY pnpm-lock.yaml /
EXPOSE 3333

FROM base as dev
ENV NODE_ENV=dev
RUN pnpm i
COPY . .
RUN pnpm build
CMD ["pnpm", "start:dev"]

FROM base as production
ENV NODE_ENV=production
RUN pnpm i
COPY --from=dev /app/dist ./dist
CMD ["node", "dist/server.js"]
