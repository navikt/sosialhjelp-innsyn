import { defineConfig } from "orval";

export default defineConfig({
    "innsyn-api": {
        input: "./innsyn-api.json",
        output: {
            mode: "tags-split",
            target: "src/generated/innsyn-api.ts",
            schemas: "src/generated/model",
            client: "react-query",
            baseUrl: "/sosialhjelp/innsyn/api/innsyn-api",
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
                            includeHttpStatusReturnType: true,
                        },
                    },
                },
                fetch: {
                    includeHttpStatusReturnType: false,
                },
                query: {
                    useSuspenseQuery: true,
                    version: 5,
                    // Legges på alle orval-genererte queries
                    options: {
                        staleTime: 60 * 1000,
                        // Bare retry ved 500-feil
                        retry: <T>(count: number, error: T) =>
                            // Typescript-jokkeri for å få TS til å være med
                            typeof error === "object" &&
                            error &&
                            "message" in error &&
                            typeof error.message === "string"
                                ? error.message.includes("500") && count < 3
                                : false,
                    },
                },
            },
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
});
