import { APIRequestContext } from "@playwright/test";

/**
 * Helper to configure MSW mock responses for E2E tests.
 * This allows mocking both server-side (Server Components) and client-side API calls.
 */
export class MswHelper {
    constructor(
        private request: APIRequestContext,
        private baseURL: string
    ) {}

    /**
     * Set a mock response for a specific endpoint
     */
    async mockEndpoint(endpoint: string, response: unknown) {
        await this.request.post(`${this.baseURL}/api/test/msw`, {
            data: { endpoint, response },
        });
    }

    /**
     * Reset all MSW handlers to their defaults
     */
    async reset() {
        await this.request.post(`${this.baseURL}/api/test/msw`, {
            data: { endpoint: "reset" },
        });
    }

    /**
     * Mock saker (søknader) endpoint with empty array
     */
    async mockEmptySaker() {
        await this.mockEndpoint("/api/v1/innsyn/saker", []);
    }

    /**
     * Mock utbetalinger endpoint with empty array
     */
    async mockEmptyUtbetalinger() {
        await this.mockEndpoint("/api/v2/innsyn/utbetalinger", []);
    }

    /**
     * Mock both saker and utbetalinger with empty arrays
     */
    async mockEmptyState() {
        await this.mockEmptySaker();
        await this.mockEmptyUtbetalinger();
    }
}

/**
 * Create a MSW helper instance for the current test
 */
export function createMswHelper(request: APIRequestContext, baseURL: string): MswHelper {
    return new MswHelper(request, baseURL);
}
