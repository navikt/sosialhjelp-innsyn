import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        exclude: [...configDefaults.exclude, "**/e2e/**/*.ts"],
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
    },
});
