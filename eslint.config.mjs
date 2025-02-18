import prettier from "eslint-plugin-prettier";
import testingLibrary from "eslint-plugin-testing-library";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ["src/generated/**/*", "next.config.js"],
    },
    ...compat.extends(
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier"
    ),
    {
        plugins: {
            prettier,
            "testing-library": testingLibrary,
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "no-console": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "prettier/prettier": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

            "import/order": [
                "warn",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                },
            ],

            "import/no-extraneous-dependencies": "error",
            "react-hooks/exhaustive-deps": ["warn"],

            "react/jsx-curly-brace-presence": [
                "warn",
                {
                    props: "never",
                    children: "never",
                },
            ],

            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
        },
    },
    ...compat.extends("plugin:testing-library/react").map((config) => ({
        ...config,
        files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    })),
    {
        files: ["**/?(*.)+(spec|test).[jt]s?(x)"],

        rules: {
            "testing-library/no-debugging-utils": "warn",
        },
    },
];
