# Project Conventions

## Stack
- **Runtime**: Bun (no npm, no yarn)
- **Framework**: TanStack Start (React, SSR)
- **Routing**: TanStack Router (file-based, `src/routes/`)
- **Styling**: Tailwind CSS v4 + shadcn
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: better-auth
- **Billing**: @scrawn/core + @scrawn/analytics SDKs

## Commands
- `bun dev` — dev server on port 3000
- `bun run build` — production build
- `bun run typecheck` — TypeScript type checking
- `bun run lint` — ESLint
- `bun run format` — Prettier
- `bun run test` — Vitest

## Conventions
- Use `@/` path alias for `src/` imports
- Server-only logic (DB, gRPC, env vars) lives in `src/lib/`
- Tailwind classes only (no CSS modules)
- No comments in code unless essential
- Prefer arrow functions for components
- Use `camelCase` for variables/functions, `PascalCase` for components/types
