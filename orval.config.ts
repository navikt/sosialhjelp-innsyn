export default {
    "innsyn-api": {
        input: "./innsyn-api.json",
        output: {
            mode: "tags-split",
            target: "generated/innsyn-api.ts",
            schemas: "generated/model",
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
};
