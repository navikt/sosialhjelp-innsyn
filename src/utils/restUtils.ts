export function isProd() {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod";
}

export function isLocalhost() {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "local";
}

export function isMock(): boolean {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "mock";
}
