FROM node:22-bookworm-slim AS base

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV HOST=0.0.0.0

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
