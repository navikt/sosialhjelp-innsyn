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
                },
            },
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
});
