import { browserEnv } from "@config/env";

export const deleteFile = async (uploadId: string): Promise<void> => {
    const response = await fetch(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/files/${encodeURIComponent(uploadId)}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Feil ved sletting av fil: ${response.status}`);
    }
};
