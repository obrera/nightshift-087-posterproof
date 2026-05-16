FROM oven/bun:1.3.12 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM lipanski/docker-static-website:2.4.0
COPY --from=build /app/dist .
