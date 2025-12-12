# E2E Testing Guide: Mocking API Calls with MSW

## Overview

This guide explains how to mock API calls in Playwright E2E tests, including both server-side (Server Components) and client-side requests.

## The Problem

Next.js Server Components fetch data on the server before rendering. Traditional Playwright `page.route()` only intercepts browser requests, not Node.js server-side requests.

## The Solution

We use **MSW (Mock Service Worker)** on the server + a test control API to dynamically configure mocks per test.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Playwright Test                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  1. Configure MSW via /api/test/msw             │   │
│  │  2. Navigate to page                            │   │
│  │  3. Assert rendered content                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Next.js Server (NODE_ENV=test)                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  MSW Server (started by instrumentation.ts)    │   │
│  │  ↓                                              │   │
│  │  Server Components fetch data                  │   │
│  │  ↓                                              │   │
│  │  MSW intercepts & returns mock data            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Files Modified

### 1. `src/instrumentation.ts`

Starts MSW server when running in e2e mode:

```typescript
if (process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "e2e") {
    const { server } = await import("./mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
}
```

### 2. `src/mocks/server.ts`

Defines default MSW handlers for all API endpoints.

### 3. `src/app/api/test/msw/route.ts`

Test control API that allows dynamically setting mock responses:

- `POST /api/test/msw` with `{ endpoint, response }`
- Only available in test/e2e/local environments

### 4. `e2e/helpers/msw-helpers.ts`

Helper class for cleaner test code.

## Usage Guide

### Basic Example

```typescript
import { test, expect } from "@playwright/test";
import { createMswHelper } from "../helpers/msw-helpers";

test("example test", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);

    // Mock an endpoint with custom data
    await msw.mockEndpoint("/api/v1/innsyn/saker", [
        {
            fiksDigisosId: "test-id",
            soknadTittel: "Test Søknad",
            sistOppdatert: "2025-12-01T10:00:00Z",
            isPapirSoknad: false,
        },
    ]);

    // Navigate and test
    await page.goto("/sosialhjelp/innsyn/nb/soknader");
    await expect(page.getByText("Test Søknad")).toBeVisible();
});
```

### Using Helper Methods

```typescript
test("empty state test", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);

    // Mock multiple endpoints as empty
    await msw.mockEmptyState(); // Mocks both saker and utbetalinger

    await page.goto("/sosialhjelp/innsyn/nb/landingsside");
    await expect(page.getByText("Ingen søknader")).toBeVisible();
});
```

### Resetting Between Tests

```typescript
test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset(); // Reset all handlers to defaults
});
```

### Custom Endpoint Mocking

```typescript
test("custom endpoint", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);

    // Mock any endpoint
    await msw.mockEndpoint("/api/v1/innsyn/sak/123/detaljer", {
        fiksDigisosId: "123",
        soknadTittel: "My Application",
        status: "UNDER_BEHANDLING",
        // ... more properties
    });

    await page.goto("/sosialhjelp/innsyn/nb/123/status");
});
```

## Adding New Mock Endpoints

To add support for a new endpoint in the test control API:

1. **Update `src/app/api/test/msw/route.ts`:**

```typescript
if (endpoint === "/api/v1/your-new-endpoint") {
    server.use(
        http.get("*/api/v1/your-new-endpoint", async () => {
            return HttpResponse.json(response as YourType[], { status: 200 });
        })
    );
}
```

2. **Add helper method in `e2e/helpers/msw-helpers.ts`:**

```typescript
async mockYourEndpoint(data: YourType[]) {
    await this.mockEndpoint("/api/v1/your-new-endpoint", data);
}
```

## Real-World Examples

### Example 1: Landingsside Tests

See: `e2e/landingsside/Landingsside.spec.ts`

Tests the landing page with/without data to verify conditional rendering.

### Example 2: Testing Error States

```typescript
test("handles API error", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);

    // You can extend the control API to support error responses
    await msw.mockEndpoint("/api/v1/innsyn/saker", []);

    await page.goto("/sosialhjelp/innsyn/nb/soknader");
    await expect(page.getByText("Ingen søknader")).toBeVisible();
});
```

### Example 3: Testing with Multiple Søknader

```typescript
test("displays multiple applications", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);

    await msw.mockEndpoint("/api/v1/innsyn/saker", [
        { fiksDigisosId: "1", soknadTittel: "Søknad 1" /* ... */ },
        { fiksDigisosId: "2", soknadTittel: "Søknad 2" /* ... */ },
        { fiksDigisosId: "3", soknadTittel: "Søknad 3" /* ... */ },
    ]);

    await page.goto("/sosialhjelp/innsyn/nb/soknader");
    await expect(page.getByText("Søknad 1")).toBeVisible();
    await expect(page.getByText("Søknad 2")).toBeVisible();
    await expect(page.getByText("Søknad 3")).toBeVisible();
});
```

## Debugging Tips

### 1. Check if MSW Started

Look for this log when running tests:

```
🔶 MSW server started for e2e tests
```

### 2. Verify Environment

```typescript
console.log(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT); // Should be "e2e"
```

### 3. Check Request Interception

Add logging to your test:

```typescript
page.on("request", (request) => {
    if (request.url().includes("/api/")) {
        console.log("Request:", request.url());
    }
});
```

### 4. Inspect MSW Handlers

In the control API, you can add logging:

```typescript
console.log("Setting mock for:", endpoint, "with data:", response);
```

## Common Patterns

### Pattern 1: Test Suite Setup

```typescript
test.describe("Landingsside", () => {
    test.afterEach(async ({ request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.reset();
    });

    test("scenario 1", async ({ page, request, baseURL }) => {
        // Test code
    });

    test("scenario 2", async ({ page, request, baseURL }) => {
        // Test code
    });
});
```

### Pattern 2: Shared Mock Data

```typescript
const MOCK_DATA = {
    saker: [{ fiksDigisosId: "1", soknadTittel: "Test" /* ... */ }],
    utbetalinger: [{ referanse: "1", tittel: "Livsopphold" /* ... */ }],
};

test("scenario", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/saker", MOCK_DATA.saker);
    await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", MOCK_DATA.utbetalinger);
    // ...
});
```

### Pattern 3: Testing Loading States

```typescript
test("shows loading state", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);

    // Mock with delay (extend control API to support this)
    await msw.mockEndpoint("/api/v1/innsyn/saker", [
        /* data */
    ]);

    const navigation = page.goto("/sosialhjelp/innsyn/nb/soknader");

    // Check loading state appears
    await expect(page.getByTestId("loading-spinner")).toBeVisible();

    await navigation;

    // Check content appears after loading
    await expect(page.getByText("Test Søknad")).toBeVisible();
});
```

## Troubleshooting

### Issue: Mocks not working

**Check:**

1. Environment is set to "e2e" in `.env.test`
2. MSW server started (check console logs)
3. Endpoint path matches exactly (including `/api/` prefix)
4. Mock is set before navigating to page

### Issue: Tests interfering with each other

**Solution:**
Always reset MSW handlers in `afterEach`:

```typescript
test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});
```

### Issue: TypeScript errors

**Check:**

1. Import types from `@generated/model`
2. Use correct property names matching the API schema
3. Include all required fields in mock data

## Best Practices

1. ✅ **Always reset handlers** after each test
2. ✅ **Use typed mock data** matching your API schema
3. ✅ **Group related mocks** into reusable constants
4. ✅ **Test both empty and populated states**
5. ✅ **Use helper methods** for common scenarios
6. ❌ **Don't mock too broadly** - be specific about what you need
7. ❌ **Don't forget to await** mock setup calls
8. ❌ **Don't rely on default MSW data** - always set explicit mocks

## Next Steps

1. Apply this pattern to other E2E test files
2. Add more helper methods for common scenarios
3. Extend control API to support error responses, delays, etc.
4. Consider adding fixtures for common mock data sets
