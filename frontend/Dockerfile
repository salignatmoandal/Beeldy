
FROM node:20-alpine


WORKDIR /app


RUN npm install -g pnpm


COPY package.json pnpm-lock.yaml ./


RUN pnpm install


COPY . .


EXPOSE 3001

CMD ["pnpm", "run", "dev", "--", "-p", "3001"]