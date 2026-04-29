import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
    plugins: [react()],
    resolve: {
        tsconfigPaths: true
    },
    test: {
        exclude: [...configDefaults.exclude, "**/e2e/**/*.ts"],
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
    },
});
