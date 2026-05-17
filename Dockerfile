FROM oven/bun:1.3.12 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --minimum-release-age=0 --ignore-scripts
COPY . .
RUN bun run build

FROM beeman/static-server:latest
COPY --from=build /app/dist /workspace/app
EXPOSE 9876
