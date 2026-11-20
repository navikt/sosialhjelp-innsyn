import { browserEnv } from "@config/env";
import { UploadState, ValidationCode } from "./useDocumentState";

export type UploadFileResult =
    | { kind: "stored"; upload: UploadState; submissionId: string }
    | { kind: "rejected"; validations: ValidationCode[] }
    | { kind: "failed"; stage?: "CONVERSION" | "STORAGE" }
    | { kind: "forbidden" }
    | { kind: "tooLarge" }
    | { kind: "invalid" };

type UploadResponse = { upload: UploadState; submissionId: string };

// Ingen logging her: filnavn og innhold er personopplysninger.
export const uploadFile = async ({
    file,
    contextId,
    correlationId,
    targetFields,
}: {
    file: File;
    contextId: string;
    correlationId: string;
    targetFields: Record<string, string>;
}): Promise<UploadFileResult> => {
    const body = new FormData();
    body.append("file", file, file.name);
    body.append("contextId", contextId);
    body.append("correlationId", correlationId);
    Object.entries(targetFields).forEach(([key, value]) => body.append(key, value));
    body.append("automaticCleanup", "true");

    let response: Response;
    try {
        response = await fetch(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/files`, { method: "POST", body });
    } catch {
        return { kind: "failed" };
    }

    try {
        if (response.status === 200 || response.status === 201) {
            const { upload, submissionId } = (await response.json()) as UploadResponse;
            return {
                kind: "stored",
                upload: { ...upload, correlationId: upload.correlationId ?? correlationId },
                submissionId,
            };
        }
        if (response.status === 422) {
            const json = (await response.json()) as { validations?: ValidationCode[] };
            return { kind: "rejected", validations: json.validations ?? [] };
        }
        if (response.status === 502) {
            const json = (await response.json().catch(() => ({}))) as { stage?: "CONVERSION" | "STORAGE" };
            return { kind: "failed", stage: json.stage };
        }
        if (response.status === 403) return { kind: "forbidden" };
        if (response.status === 413) return { kind: "tooLarge" };
        if (response.status === 400) return { kind: "invalid" };
    } catch {
        return { kind: "failed" };
    }
    return { kind: "failed" };
};
