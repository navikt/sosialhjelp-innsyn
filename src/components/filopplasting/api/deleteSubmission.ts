import { browserEnv } from "@config/env";

/** Deletes a submission and all its uploads. */
export const deleteSubmission = async (submissionId: string) => {
    const response = await fetch(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/submission/${submissionId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Feil ved sletting av opplastinger: ${response.status} ${response.statusText}`);
    }
};
