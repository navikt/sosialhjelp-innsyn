import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";
import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

/** Content security policy */
const [SELF, UNSAFE_INLINE, UNSAFE_EVAL] = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
const [DATA, BLOB] = ["data:", "blob:"];

const isLocal = process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local";
const isProd = process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod";

const localServer = process.env.NEXT_PUBLIC_INNSYN_ORIGIN ?? "";
const fileStorageOrigin = isLocal ? "http://localhost:3007" : "https://storage.googleapis.com";
const innsynApiLocalhost = "http://localhost:8989";
const uxsignalsScriptSrc = "https://uxsignals-frontend.uxsignals.app.iterate.no";
const pdfjsDistCdnOrigin = "https://cdnjs.cloudflare.com";

const appDirectives = {
    "default-src": [SELF],
    "script-src": [SELF, UNSAFE_EVAL, uxsignalsScriptSrc, pdfjsDistCdnOrigin],
    "script-src-elem": [SELF, uxsignalsScriptSrc, pdfjsDistCdnOrigin],
    "style-src": [SELF, UNSAFE_INLINE, localServer],
    "style-src-elem": [SELF, UNSAFE_INLINE, localServer],
    "img-src": [SELF, DATA, BLOB, uxsignalsScriptSrc, fileStorageOrigin],
    "font-src": [SELF],
    "worker-src": [SELF, fileStorageOrigin, pdfjsDistCdnOrigin],
    "connect-src": [SELF, fileStorageOrigin, ...(isLocal ? [innsynApiLocalhost, localServer] : [])],
};

const imageRemotePattern: RemotePattern = localServer
    ? {
          hostname: "localhost",
          protocol: "http",
          port: "3007",
          pathname: "/sosialhjelp/upload/files/**",
      }
    : {
          hostname: "storage.googleapis.com",
          protocol: "https",
          pathname: "/**",
      };

const nextConfig: NextConfig = {
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
    images: {
        remotePatterns: [imageRemotePattern],
    },
    assetPrefix: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_ASSET_PREFIX : undefined,
    reactStrictMode: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    serverExternalPackages: ["@navikt/next-logger", "next-logger", "pino"],
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
});
