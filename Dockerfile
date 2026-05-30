FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/vite.config.ts ./vite.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/public ./public
COPY --from=build /app/components.json ./components.json
COPY package.json ./
EXPOSE 3000
CMD ["sh", "-c", "for i in 1 2 3 4 5; do bunx drizzle-kit push --force && break; sleep 3; done && bun run preview -- --port 3000 --host"]