
FROM node:20-alpine AS builder

WORKDIR /app


COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install


COPY . .


RUN pnpm build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production


COPY --from=builder /app ./

EXPOSE 3001


CMD ["pnpm", "start", "--", "-p", "3001"]