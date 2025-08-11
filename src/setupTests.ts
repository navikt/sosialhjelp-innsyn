import { cleanup, configure } from "@testing-library/react";
import { vi, beforeAll, afterAll, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";

import { server } from "./mocks/server";
import { queryCache, queryClient } from "./test/test-utils";

configure({ asyncUtilTimeout: 3000 });

vi.mock("@navikt/nav-dekoratoren-moduler", () => ({ setBreadcrumbs: vi.fn() }));
vi.mock("next/router", async () => ({ ...(await import("next-router-mock")) }));
vi.mock("unleash-proxy-client", vi.fn());

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

mockRouter.useParser(
    createDynamicRouteParser([
        // These paths should match those found in the `/pages` folder:
        "/[id]/status",
        "/utbetaling",
        "/",
        "/403",
        "/404",
        "/500",
    ])
);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    server.resetHandlers();
    queryCache.clear();
    cleanup();
});

// Clean up after the tests are finished.
afterAll(async () => {
    await queryClient.cancelQueries();
    server.close();
});
