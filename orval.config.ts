import {sendVedlegg} from "./src/generated/vedlegg-controller/vedlegg-controller";

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
};
