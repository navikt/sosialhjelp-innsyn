import { browserEnv } from "@config/env";
import { UploadState, ValidationCode } from "./useDocumentState";

export type SubmissionState = {
    submissionId: string;
    uploads: UploadState[];
    validations: ValidationCode[];
    status: string;
    error?: string;
};

export type SubmissionStatusResult = { kind: "ok"; state: SubmissionState } | { kind: "forbidden" };

export const fetchSubmissionStatus = async (contextId: string): Promise<SubmissionStatusResult> => {
    const response = await fetch(
        `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/submission/context/${encodeURIComponent(contextId)}`,
        { cache: "no-store" }
    );
    if (response.status === 403) return { kind: "forbidden" };
    if (!response.ok) throw new Error(`Feil ved henting av status: ${response.status}`);
    return { kind: "ok", state: (await response.json()) as SubmissionState };
};
