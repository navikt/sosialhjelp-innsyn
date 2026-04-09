# AGENTS.md — sosialhjelp-innsyn

Frontend for tracking Norwegian social welfare ("sosialhjelp") applications. Built with Next.js (App Router + Pages Router hybrid), React 19, TypeScript, and TanStack React Query.

## Package Manager

Always use `pnpm` and `pnpm dlx`. Never `npm`, `npx`, or `yarn`. Use `jq` for inspecting JSON files.

## Commands

```bash
pnpm dev          # Dev server on :3002
pnpm build        # Production build
pnpm test         # Run all unit tests (Vitest)
pnpm test -- path/to/file.test.tsx  # Single test file
pnpm lint         # ESLint
pnpm tsc          # Type-check only
pnpm e2e          # Playwright E2E (headless)
pnpm e2e:ui       # Playwright with UI mode (recommended for debugging)

# When the API schema changes:
pnpm fetch-api-docs   # Pull latest OpenAPI spec from dev env → innsyn-api.json
pnpm orval            # Regenerate types and hooks from innsyn-api.json
```

## Architecture

### Routing — Hybrid App Router + Pages Router

Both routers coexist under a shared `[locale]` dynamic segment:

- `src/app/[locale]/` — App Router pages (active development)
- `src/pages/[locale]/` — Pages Router pages (legacy, being migrated away)
- `src/app/[locale]/Providers.tsx` — wraps app in `QueryClientProvider`, `FlagProvider`, and `TilgangskontrollsideApp`
- `src/proxy.ts` — middleware handling i18n routing and feature-flag-driven rewrites (e.g. old `/status` URLs → `/soknad/[id]`)

### API Layer — Orval-generated React Query hooks

**Do not edit `src/generated/` manually.** All types and hooks are generated from `innsyn-api.json` via `pnpm orval`.

Two fetch mutators:

- `src/custom-fetch.ts` → `customFetch` — client-side, proxied through `/api/innsyn-api`
- `src/api/ssr/authenticatedFetch.ts` — server-side RSC fetch with token forwarding

`src/api/queryClient.ts`: singleton on client, fresh instance per request on server (Next.js HMR-safe). In E2E environments `staleTime` is set to `Infinity` to prevent background refetches during tests.

Generated hooks live in controller-named subdirectories, e.g. `src/generated/saks-oversikt-controller/`. Each controller directory also exports `.msw.ts` files with mock factories for testing.

### Feature Toggles

Toggles are fetched server-side via Unleash (`src/featuretoggles/unleash.ts`) and passed to `FlagProvider` in `Providers.tsx`. All expected toggle names are defined in `src/featuretoggles/toggles.ts`.

```ts
// Reading a toggle in a client component:
const toggle = useFlag("sosialhjelp.innsyn.klage");
if (toggle.enabled) { ... }
```

Toggles can be overridden locally via cookies: set a cookie named after the toggle with value `"true"` or `"false"`.

### Styling

- **Tailwind 4** via `@tailwindcss/postcss` with NAV design tokens (`text-ax-*`, `bg-ax-*`, `ax-md:` breakpoint)
- **`@navikt/ds-react`** — NAV design system component library; prefer it over custom UI

### i18n

`next-intl` with `messages/nb.json` as the primary translation file. Use `useTranslations()` in client components and `getTranslations()` in server components / RSCs.

### Environment Variables

- `NEXT_PUBLIC_*` — client-accessible, validated via `browserEnv` from `src/config/env.ts`
- `NEXT_INNSYN_*` — server-only, accessed via `getServerEnv()` from the same module
- `NEXT_PUBLIC_RUNTIME_ENVIRONMENT` values: `local | mock | dev | preprod | prod | e2e`

## Path Aliases

Defined in `tsconfig.json`:

| Alias               | Path                   |
| ------------------- | ---------------------- |
| `@api/*`            | `src/api/*`            |
| `@components/*`     | `src/components/*`     |
| `@config/*`         | `src/config/*`         |
| `@featuretoggles/*` | `src/featuretoggles/*` |
| `@generated/*`      | `src/generated/*`      |
| `@hooks/*`          | `src/hooks/*`          |
| `@test/*`           | `src/test/*`           |
| `@utils/*`          | `src/utils/*`          |

## Testing

### Unit Tests (Vitest + React Testing Library)

- Tests are colocated as `*.test.ts(x)` next to source files.
- **Always import `render`, `renderHook`, `screen` from `@test/test-utils`**, not directly from `@testing-library/react`. This wrapper provides `QueryClientProvider` and `NextIntlClientProvider`.
- MSW is set up in `src/mocks/server.ts` and started in `src/setupTests.ts`. Use generated `.msw.ts` mock factories for handler responses.

### E2E Tests (Playwright)

- Tests in `e2e/` run against `pnpm dev` with `NEXT_PUBLIC_RUNTIME_ENVIRONMENT=test`.
- **`workers: 1`** — tests are serial because `e2eServer` is shared via `globalThis.__E2E_MSW_SERVER__`.
- MSW API mocking is controlled at runtime through `POST /api/test/msw` (only active in `test`/`e2e`/`local` environments).
- Use `MswHelper` from `e2e/helpers/msw-helpers.ts`:

```ts
test("shows empty state", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEmptyState(); // mocks saker, utbetalinger, driftsmeldinger
    await page.goto("/");
});
```

- `mockSoknadEndpoints(msw, soknadId, overrides?)` sets up all endpoints needed for a single søknad detail page.
- Default handlers in `src/mocks/e2eServer.ts` log warnings and return empty/sensible defaults — override them per-test.
