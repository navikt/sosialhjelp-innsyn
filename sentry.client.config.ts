import * as Sentry from "@sentry/nextjs";
import {isProd} from "./src/utils/restUtils";

Sentry.init({
    dsn: "https://be38195df549433ea37648dfbc4e074e@sentry.gc.nav.no/103",
    integrations: [new Sentry.BrowserTracing()],
    environment: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod" ? "prod-sbs" : "development",
    enabled: process.env.NODE_ENV === "production",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // ...

    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
});
