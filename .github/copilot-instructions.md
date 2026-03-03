# Copilot Instructions — sosialhjelp-innsyn

Frontend for viewing and tracking Norwegian social welfare ("sosialhjelp") applications. Built with Next.js (App Router + Pages Router hybrid), React 19, TypeScript.

## Package manager

Always use `pnpm` and `pnpm dlx` — never `npm`, `npx`, or `yarn`.

Use `jq` for reading/inspecting JSON files from the command line.

## Commands

```bash
pnpm dev          # Dev server on :3002
pnpm build        # Production build
pnpm test         # Run all unit tests (Vitest)
pnpm test -- path/to/file.test.tsx   # Run a single test file
pnpm lint         # ESLint
pnpm tsc          # Type-check only
pnpm e2e          # Playwright E2E tests
pnpm e2e:ui       # Playwright with UI mode

# When the API schema changes:
pnpm fetch-api-docs   # Pull latest OpenAPI spec from dev environment
pnpm orval            # Regenerate types and hooks from innsyn-api.json
```

## Architecture

### Routing — Hybrid App Router + Pages Router

Both coexist and share the `[locale]` dynamic segment for i18n (Norwegian bokmål `nb` only in practice).

- `src/app/[locale]/` — App Router pages (newer features)
- `src/pages/[locale]/` — Pages Router pages (legacy, being migrated)
- `src/app/[locale]/Providers.tsx` — wraps the app in QueryClientProvider, NextIntlClientProvider, etc.

### API layer — Orval-generated React Query hooks

All server state goes through TanStack React Query. Hooks are **auto-generated** from `innsyn-api.json` into `src/generated/innsyn-api.ts` — do not edit that file manually.

Two fetch mutators are used by orval:

- `src/custom-fetch.ts` → `customFetch` (client-side, proxied via `/api/innsyn-api`)
- `src/api/ssr/authenticatedFetch.ts` (server-side SSR fetching with token exchange)

`src/api/queryClient.ts` exports `getQueryClient()` — singleton on the client, fresh instance on the server (Next.js HMR-safe pattern).

### Styling

- **Tailwind 4** via `@tailwindcss/postcss` with the `@navikt/ds-tailwind` preset (NAV design tokens as utility classes, e.g. `text-ax-*`, `bg-ax-*`, `ax-md:` breakpoint)
- **Styled-components 6** (with Next.js SSR compiler) for dynamic or complex styles. To be removed with the pages router migration.
- **@navikt/ds-react** is the NAV design system component library — prefer it over building custom UI

### State management

- **React Query** for all server/async state
- **Context API** for feature flags (`src/featuretoggles/`), file upload state, tag sizing

### i18n

`next-intl` with translation files in `messages/nb.json`. Use `useTranslations()` in client components, `getTranslations()` in server components/RSCs.

## Key Conventions

### React hooks

Import hooks directly — never prefix with `React.`:

```ts
// ✅
import { useState, useEffect } from "react";

// ❌
React.useState(...)
```

### Testing

#### Unit tests with Vitest + React Testing Library

- Tests are colocated with source files as `*.test.ts(x)`
- Import `render`, `renderHook`, `screen`, etc. from `@/test/test-utils` (not directly from `@testing-library/react`) — this wrapper provides QueryClient + NextIntlClientProvider
- MSW (`src/mocks/`) handles API mocking in tests; the server is started in `src/setupTests.ts`

#### E2E tests with Playwright

- Tests are in `e2e/` with source files as `*.spec.ts(x)` and run against a locally running dev server (`pnpm dev`)
- The dev server is started with `NODE_ENV=test`, which activates MSW for API mocking

#### E2E MSW mocking setup

API responses are controlled via MSW running inside the Next.js server process (not in the browser):

- **`src/mocks/e2eServer.ts`** — MSW Node server (`e2eServer`) stored on `globalThis` to ensure a single shared instance across Next.js module reloads. Provides default handlers for common endpoints (saker, utbetalinger, tilgang, etc.) that log warnings and return sensible defaults.
- **`src/app/api/test/msw/route.ts`** — `POST /api/test/msw` Next.js route that lets tests dynamically add or reset MSW handlers at runtime. Only active when `NEXT_PUBLIC_RUNTIME_ENVIRONMENT` is `test`, `e2e`, or `local`.
- **`e2e/helpers/msw-helpers.ts`** — `MswHelper` class (create with `createMswHelper(request, baseURL)`) that wraps the control API. Use `mockEndpoint(path, response)` to override a handler, `reset()` to restore defaults, and convenience methods like `mockEmptyState()` or `mockSoknadEndpoints(msw, soknadId, overrides?)` for common scenarios.

Playwright is configured with `workers: 1` because `e2eServer` is shared via `globalThis` — parallel workers would interfere with each other's mocks.

```ts
// Example usage in a test
test("shows empty state", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEmptyState();
    await page.goto("/");
    // ...
});
```

### Environment / config

- Server-only env vars: `NEXT_INNSYN_*` (no `NEXT_PUBLIC_` prefix)
- Client-accessible env vars: `NEXT_PUBLIC_*`
- Access via helpers in `src/config/env.ts` — `browserEnv` for client, `getServerEnv()` for server

### GitHub package registry

`@navikt/*` packages are published to GitHub's npm registry. Local setup requires:

```bash
npm login --scope=@navikt --registry=https://npm.pkg.github.com
# username: GitHub username, password: PAT with repo + read:packages + SSO enabled
```

### Local backend

Requires the `digisos-docker-compose` repo running `sosialhjelp-mock-alt`, `sosialhjelp-mock-alt-api`, and `sosialhjelp-innsyn-api`. Copy `.env.local` from the README example.
