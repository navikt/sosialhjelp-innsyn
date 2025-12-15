import path from "path";

import { defineConfig, devices, PlaywrightTestConfig } from "@playwright/test";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3002;
type OptionsType = { baseURL: string; timeout: number; server: PlaywrightTestConfig["webServer"] | undefined };
const opts: OptionsType = process.env.CI
    ? {
          baseURL: `http://localhost:3002/sosialhjelp/innsyn`,
          timeout: 30 * 1000,
          // Uses service container app
          server: undefined,
      }
    : {
          baseURL: `http://localhost:${PORT}/sosialhjelp/innsyn`,
          timeout: 30 * 1000,
          server: {
              command: "NODE_ENV=test pnpm run dev",
              url: `http://localhost:${PORT}/sosialhjelp/innsyn/api/internal/is_alive`,
              timeout: 120 * 1000,
              reuseExistingServer: true,
              stderr: "pipe",
              stdout: "pipe",
          },
      };

export default defineConfig({
    timeout: opts.timeout,
    testDir: path.join(__dirname, "e2e"),
    retries: process.env.CI ? 2 : 0,
    // Must use single worker because e2eServer is shared via globalThis - parallel tests would interfere with each other's mocks
    workers: 1,
    reporter: process.env.CI ? "blob" : "html",
    forbidOnly: !!process.env.CI,
    outputDir: "test-results/",

    webServer: opts.server,

    use: {
        baseURL: opts.baseURL,
        trace: "on",
    },

    projects: [
        {
            name: "Desktop Chrome",
            use: {
                locale: "nb",
                ...devices["Desktop Chrome"],
            },
        },
        {
            name: "Mobile Chrome",
            use: {
                locale: "nb",
                ...devices["Pixel 5"],
            },
        },
    ],
});
