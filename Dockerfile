FROM node:22-bookworm-slim AS base

WORKDIR /app

COPY package.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
ENV HOST=0.0.0.0

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
