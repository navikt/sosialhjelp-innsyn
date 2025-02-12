// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    setupFiles: ["<rootDir>/jest.polyfills.js"],
    testEnvironment: "jest-fixed-jsdom",
    testEnvironmentOptions: {
        customExportConditions: [""],
    },
};

// Prevents snapshot tests from failing because Github runners will
// be UTC and dev machines generally Europe/Oslo.
process.env.TZ = "UTC";

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
