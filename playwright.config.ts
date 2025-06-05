import path from "path";

import { defineConfig, devices, PlaywrightTestConfig } from "@playwright/test";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3002;
type OptionsType = { baseURL: string; timeout: number; server: PlaywrightTestConfig["webServer"] | undefined };
const opts: OptionsType = process.env.CI
    ? {
          baseURL: `http://localhost:3000/sosialhjelp/innsyn/nb`,
          timeout: 30 * 1000,
          // Uses service container app
          server: undefined,
      }
    : {
          baseURL: `http://localhost:${PORT}/sosialhjelp/innsyn/nb`,
          timeout: 60 * 1000,
          server: {
              command: "NODE_ENV=test npm run dev --turbo",
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
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? "blob" : "html",
    forbidOnly: !!process.env.CI,
    outputDir: "test-results/",

    webServer: opts.server,

    use: {
        baseURL: opts.baseURL,
        trace: "retry-with-trace",
    },

    projects: [
        {
            name: "Desktop Chrome",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
        {
            name: "Mobile Chrome",
            use: {
                ...devices["Pixel 5"],
            },
        },
    ],
});
