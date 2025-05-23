const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");
const createNextIntlPlugin = require("next-intl/plugin");

/** Content security policy */
const [SELF, UNSAFE_INLINE, UNSAFE_EVAL] = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
const [DATA, BLOB] = ["data:", "blob:"];

const isLocal = process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local";
const isProd = process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod";

const localServer = process.env.NEXT_PUBLIC_INNSYN_ORIGIN ?? "";
const innsynApiLocalhost = "http://localhost:8989";
const uxsignalsScriptSrc = "https://uxsignals-frontend.uxsignals.app.iterate.no";

const appDirectives = {
    "default-src": [SELF],
    "script-src": [SELF, UNSAFE_EVAL, uxsignalsScriptSrc],
    "script-src-elem": [SELF, uxsignalsScriptSrc],
    "style-src": [SELF, UNSAFE_INLINE, localServer],
    "style-src-elem": [SELF, UNSAFE_INLINE, localServer],
    "img-src": [SELF, DATA, BLOB, uxsignalsScriptSrc],
    "font-src": [SELF],
    "worker-src": [SELF],
    "connect-src": isLocal ? [SELF, innsynApiLocalhost, localServer] : [SELF],
};

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    headers: async () => [
        {
            source: "/:path*",
            headers: [
                {
                    key: "Content-Security-Policy",
                    value: await buildCspHeader(appDirectives, { env: isProd ? "prod" : "dev" }),
                },
            ],
        },
    ],
    output: "standalone",
    assetPrefix: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
    reactStrictMode: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    experimental: {
        scrollRestoration: true,
        optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ["src"],
    },
    productionBrowserSourceMaps: true,
};

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl({
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
});
