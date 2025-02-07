import { Faro, getWebInstrumentations, initializeFaro, LogLevel } from "@grafana/faro-web-sdk";

import { isLocalhost, isMock } from "../utils/restUtils";

let faro: Faro | null = null;
export function initInstrumentation(): void {
    if (typeof window === "undefined" || faro !== null) return;

    getFaro();
}

export function getFaro(): Faro | null {
    if (process.env.NEXT_PUBLIC_TELEMETRY_URL == null) return null;

    if (faro != null) return faro;
    faro = initializeFaro({
        paused: isLocalhost() || isMock(),
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: "sykmeldinger",
        },
        instrumentations: [
            ...getWebInstrumentations({
                captureConsole: false,
            }),
        ],
    });
    return faro;
}

export function pinoLevelToFaroLevel(pinoLevel: string): LogLevel {
    switch (pinoLevel) {
        case "trace":
            return LogLevel.TRACE;
        case "debug":
            return LogLevel.DEBUG;
        case "info":
            return LogLevel.INFO;
        case "warn":
            return LogLevel.WARN;
        case "error":
            return LogLevel.ERROR;
        default:
            throw new Error(`Unknown level: ${pinoLevel}`);
    }
}
