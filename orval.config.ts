export default {
    "innsyn-api": {
        input: "./innsyn-api.json",
        output: {
            mode: "tags-split",
            target: "src/generated/innsyn-api.ts",
            schemas: "src/generated/model",
            client: "react-query",
            override: {
                mutator: {
                    path: "./src/axios-instance.ts",
                    name: "axiosInstance",
                },
            },
            mock: true,
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
    driftsmeldinger: {
        input: "./driftsmelding-api.json",
        output: {
            baseUrl: "https://fakePlaceholder/", // blir overstyrt i driftsmeldingFetch.ts
            mode: "single",
            target: "src/generated/driftsmelding.ts",
            client: "fetch",
            mock: false,
            override: {
                mutator: {
                    path: "src/utils/driftsmeldingFetch.ts",
                    name: "driftsmeldingFetch",
                },
            },
        },
        hooks: {
            afterAllFilesWrite: "prettier --write",
        },
    },
};
