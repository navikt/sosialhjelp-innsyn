import { configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";

import { server } from "./mocks/server";
import { queryCache, queryClient } from "./test/test-utils";

configure({ asyncUtilTimeout: 3000 });

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("unleash-proxy-client", jest.fn());

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

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(crypto, "randomUUID", {
    value: jest.fn().mockImplementation(() => "72b12f47-cd7f-4eed-b791-9cfae155dda3"),
});

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    server.resetHandlers();
    queryCache.clear();
});

// Clean up after the tests are finished.
afterAll(async () => {
    await queryClient.cancelQueries();
    server.close();
});
