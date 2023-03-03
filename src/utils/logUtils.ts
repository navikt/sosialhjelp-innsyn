export const LOG_URL = "/info/logg";

export type LogLevel = "ERROR" | "WARN" | "INFO";

export function createLogEntry(message: string, level: LogLevel) {
    return {
        level: level,
        message: message,
        jsFileUrl: "",
        lineNumber: "",
        columnNumber: "",
        url: window.location.href,
        userAgent: window.navigator.userAgent,
    };
}
