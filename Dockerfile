FROM node:18-slim AS base


FROM base AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY src src
COPY prisma prisma
RUN npx prisma generate
COPY tsconfig.json tsconfig.vite.config.json vite.config.ts ./
RUN npm run build:server


FROM base AS node_modules

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production


FROM base AS production

WORKDIR /app

COPY --from=node_modules /app/package.json ./
COPY --from=node_modules /app/node_modules ./node_modules
COPY --from=build /app/build ./build

CMD ["npm", "start"]
