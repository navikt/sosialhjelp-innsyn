const {buildCspHeader} = require("@navikt/nav-dekoratoren-moduler/ssr");
const {i18n} = require("./next-i18next.config");

/**
 * @type {import('next').NextConfig}
 */

const appDirectives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-eval'", "https://uxsignals-frontend.uxsignals.app.iterate.no"],
    "script-src-elem": ["'self'", "https://uxsignals-frontend.uxsignals.app.iterate.no"],
    "style-src": ["'self'"],
    "img-src": ["'self'", "data:"],
    "font-src": ["'self'", "https://cdn.nav.no"],
    "worker-src": ["'self'"],
    "connect-src": [
        "'self'",
        "https://*.nav.no",
        "https://*.uxsignals.com",
        ...(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local" ? ["http://localhost:8989"] : []),
    ],
};

const {withSentryConfig} = require("@sentry/nextjs");

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

    org: "example-org",
    project: "example-project",

    // An auth token is required for uploading source maps.
    // You can get an auth token from https://sentry.io/settings/account/api/auth-tokens/
    // The token must have `project:releases` and `org:read` scopes for uploading source maps
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: true, // Suppresses all logs

    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const nextConfig = {
    async headers() {
        const environment = process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod" ? "prod" : "dev";
        const cspValue = await buildCspHeader(appDirectives, {env: environment});

        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: cspValue,
                    },
                ],
            },
        ];
    },
    output: "standalone",
    reactStrictMode: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    experimental: {
        scrollRestoration: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ["src"],
    },
    trailingSlash: true,
    productionBrowserSourceMaps: true,
    sentry: {
        // See the sections below for information on the following options:
        //   'Configure Source Maps':
        //     - disableServerWebpackPlugin
        //     - disableClientWebpackPlugin
        //     - hideSourceMaps
        //     - widenClientFileUpload
        //   'Configure Legacy Browser Support':
        //     - transpileClientSDK
        //   'Configure Serverside Auto-instrumentation':
        //     - autoInstrumentServerFunctions
        //     - excludeServerRoutes
        //   'Configure Tunneling to avoid Ad-Blockers':
        //     - tunnelRoute
    },
};

module.exports = {
    compiler: {
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: {ssr: true, displayName: true},
    },
    ...withSentryConfig(nextConfig, sentryWebpackPluginOptions),
    webpack: (config) => {
        // Unset client-side javascript that only works server-side
        config.resolve.fallback = {fs: false, module: false, path: false};
        return config;
    },
    i18n,
};
