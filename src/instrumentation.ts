/* eslint-disable @typescript-eslint/no-require-imports */

export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await require("pino");
        await require("next-logger");
    }
}
