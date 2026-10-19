import { browserEnv } from "@config/env";

import { Metadata } from "../types";

export type SubmissionError = "TOO_MANY_FILES" | "TOTAL_SIZE_TOO_LARGE" | "NO_FILES";

export const submitUpload = async ({
    submissionId,
    body,
}: {
    body: { fiksDigisosId: string; metadata: Metadata };
    submissionId: string;
}) => {
    const response = await fetch(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/submission/${submissionId}/submit`, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        if (response.status === 422) {
            throw await response.json();
        }
        throw new Error(`Feil ved opplasting av vedlegg: ${response.status} ${response.statusText}`);
    }
};
