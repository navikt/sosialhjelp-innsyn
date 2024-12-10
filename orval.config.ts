export default {
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
            },
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
};
