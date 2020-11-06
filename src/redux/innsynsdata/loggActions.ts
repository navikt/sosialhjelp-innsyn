import {fetchPost} from "../../utils/restUtils";

const LOG_URL = "/info/logg";

export function logInfoMessage(message: string, navCallId?: string) {
    loggMessage(message, "INFO", navCallId);
}

export function logWarningMessage(message: string, navCallId?: string) {
    loggMessage(message, "WARN", navCallId);
}

export function logErrorMessage(message: string, navCallId?: string) {
    loggMessage(message, "ERROR", navCallId);
}

function loggMessage(message: string, level: LogLevel, navCallId: string | undefined) {
    fetchPost(LOG_URL, JSON.stringify(createLogEntry(message, level)), undefined, navCallId)
        .then(() => {})
        .catch(() => {
            return; // Not important to handle those errors
        });
}

function createLogEntry(message: string, level: LogLevel) {
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

type LogLevel = "ERROR" | "WARN" | "INFO";
