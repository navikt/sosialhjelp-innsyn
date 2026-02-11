import { defineConfig } from "orval";

export default defineConfig({
    "innsyn-api": {
        input: "./innsyn-api.json",
        output: {
            mode: "tags-split",
            target: "src/generated/innsyn-api.ts",
            schemas: "src/generated/model",
            client: "react-query",
            baseUrl: "/",
            httpClient: "fetch",
            mock: true,
            override: {
                mutator: {
                    path: "src/custom-fetch.ts",
                    name: "customFetch",
                },
                operations: {
                    harTilgang: {
                        fetch: {
                            includeHttpResponseReturnType: true,
                        },
                    },
                },
                fetch: {
                    includeHttpResponseReturnType: false,
                },
                query: {
                    useSuspenseQuery: true,
                    version: 5,
                    // Default options for all orval-generated queries
                    options: {
                        staleTime: 60 * 1000,
                        // Retry strategy: only retry on server errors (5xx) and network errors
                        retry: (count: number, error: unknown) => {
                            // Don't retry if we've already tried 3 times
                            if (count >= 3) return false;

                            // Retry on network errors (no response)
                            if (error instanceof Error && !("status" in error)) {
                                return true;
                            }

                            // Retry on 5xx server errors only (not 4xx client errors)
                            if (
                                error &&
                                typeof error === "object" &&
                                "status" in error &&
                                typeof error.status === "number"
                            ) {
                                return error.status >= 500 && error.status < 600;
                            }

                            return false;
                        },
                        // Exponential backoff for retries
                        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                },
            },
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
    "innsyn-api-ssr": {
        input: "./innsyn-api.json",
        output: {
            mode: "tags-split",
            target: "src/generated/ssr",
            schemas: "src/generated/ssr/model",
            client: "react-query",
            httpClient: "fetch",
            baseUrl: "/",
            override: {
                fetch: {
                    includeHttpResponseReturnType: false,
                },
                query: {
                    usePrefetch: true,
                },
                mutator: {
                    path: "src/api/ssr/authenticatedFetch.ts",
                    name: "authenticatedFetch",
                },
            },
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
});
