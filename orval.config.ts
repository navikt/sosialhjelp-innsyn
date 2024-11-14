export default {
    "innsyn-api": {
        input: "./innsyn-api.json",
        output: {
            mode: "tags-split",
            target: "src/generated/innsyn-api.ts",
            schemas: "src/generated/model",
            client: "react-query",
            baseUrl: "https://www.ekstern.dev.nav.no/sosialhjelp/wonderwall-innsyn/",
            httpClient: "fetch",
            mock: true,
            override: {
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
