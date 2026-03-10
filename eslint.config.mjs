import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import testingLibrary from "eslint-plugin-testing-library";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettierConfig,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-console": "warn",
        },
    },
    {
        files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
        ...testingLibrary.configs["flat/react"],
        rules: {
            "testing-library/no-debugging-utils": "warn",
        },
    },
    globalIgnores(["src/generated/**", "playwright-report/**", "test-results/**"]),
    {
        settings: {
            // Fix for ESLint 10+: eslint-plugin-react uses context.getFilename() (legacy API)
            // which was removed in ESLint 10 flat config. Declaring the version explicitly
            // prevents the plugin from trying to auto-detect it and failing.
            react: { version: "19" },
        },
    },
]);

export default eslintConfig;
