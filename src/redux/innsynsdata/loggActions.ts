import {fetchPost} from "../../utils/restUtils";

const LOG_URL = "/info/logg";

export function logInfoMessage(message: string, navCallId?: string) {
    fetchPost(LOG_URL, JSON.stringify(createLogEntry(message, "INFO", navCallId)))
        .then(() => {})
        .catch(() => {
            return; // Not important to handle those errors
        });
}

export function logErrorMessage(message: string, navCallId?: string) {
    fetchPost(LOG_URL, JSON.stringify(createLogEntry(message, "ERROR", navCallId)))
        .then(() => {})
        .catch(() => {
            return; // Not important to handle those errors
        });
}

function createLogEntry(message: string, level: LogLevel, navCallId?: string) {
    return {
        level: level,
        message: message,
        jsFileUrl: "",
        lineNumber: "",
        columnNumber: "",
        url: window.location.href,
        userAgent: window.navigator.userAgent,
        loggenGjelderForCallId: navCallId,
    };
}

type LogLevel = "ERROR" | "WARN" | "INFO";
