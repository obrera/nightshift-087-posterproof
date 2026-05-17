FROM oven/bun:1.3.12 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --minimum-release-age=0 --ignore-scripts
COPY . .
RUN bun run build

FROM oven/bun:1.3.12
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9876
COPY --from=build /app/dist ./dist
COPY scripts/server.mjs ./scripts/server.mjs
EXPOSE 9876
CMD ["bun", "scripts/server.mjs"]
