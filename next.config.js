const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");
const { i18n } = require("./next-i18next.config");

const appDirectives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-eval'", "https://uxsignals-frontend.uxsignals.app.iterate.no"],
    "script-src-elem": ["'self'", "https://uxsignals-frontend.uxsignals.app.iterate.no"],
    "style-src": ["'self'", "unsafe-inline"],
    "img-src": ["'self'", "data:", "https://uxsignals-frontend.uxsignals.app.iterate.no"],
    "font-src": ["'self'", "https://cdn.nav.no"],
    "worker-src": ["'self'"],
    "connect-src": [
        "'self'",
        "https://*.nav.no",
        "https://*.uxsignals.com",
        ...(process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local" ? ["http://localhost:8989"] : []),
    ],
};

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    async headers() {
        const environment = process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod" ? "prod" : "dev";
        const cspValue = await buildCspHeader(appDirectives, { env: environment });
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
    assetPrefix: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
    reactStrictMode: true,
    serverExternalPackages: ["pino", "next-logger", "pino-roll"],
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    experimental: {
        scrollRestoration: true,
        optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
        esmExternals: "loose",
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ["src"],
    },
    productionBrowserSourceMaps: true,
};

module.exports = {
    compiler: {
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: { ssr: true, displayName: true },
    },
    ...nextConfig,
    webpack: (config) => {
        // Unset client-side javascript that only works server-side
        config.resolve.fallback = { fs: false, module: false, path: false };
        return config;
    },
    i18n,
};
