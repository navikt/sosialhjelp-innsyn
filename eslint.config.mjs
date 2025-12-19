import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import testingLibrary from "eslint-plugin-testing-library";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [...next, ...nextCoreWebVitals, ...nextTypescript, {
    ignores: ["src/generated/**/*", "next.config.ts", ".next/**/*", "node_modules/**/*"],
}, js.configs.recommended, {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            ecmaFeatures: {
                jsx: true,
            },
        },
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.es2021,
            ...globals.vitest,
            // React globals
            React: "readonly",
            JSX: "readonly",
            // TypeScript global types
            NodeJS: "readonly",
            HeadersInit: "readonly",
            RequestInit: "readonly",
            ResponseInit: "readonly",
            BodyInit: "readonly",
            RequestInfo: "readonly",
            RequestCache: "readonly",
            RequestCredentials: "readonly",
            RequestMode: "readonly",
            RequestRedirect: "readonly",
            ReferrerPolicy: "readonly",
            WindowEventMap: "readonly",
        },
    },
    plugins: {
        "@typescript-eslint": typescriptEslint,
        react: reactPlugin,
        "react-hooks": reactHooksPlugin,
        "@next/next": nextPlugin,
        import: importPlugin,
        prettier,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        ...typescriptEslint.configs.recommended.rules,
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs["core-web-vitals"].rules,
        ...prettierConfig.rules,
        "no-console": "warn",
        // Disable base rule as it can report incorrect errors in TypeScript
        "no-redeclare": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "prettier/prettier": "warn",
        "import/order": [
            "warn",
            {
                groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                "newlines-between": "always",
            },
        ],
        "import/no-extraneous-dependencies": "error",
        "react-hooks/exhaustive-deps": "warn",
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
}, {
    files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
        "testing-library": testingLibrary,
    },
    rules: {
        ...testingLibrary.configs.react.rules,
        "testing-library/no-debugging-utils": "warn",
    },
}];
