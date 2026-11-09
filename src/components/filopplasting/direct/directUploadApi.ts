import { z } from "zod";
import { browserEnv } from "@config/env";

const documentSchema = z.object({
    operationId: z.string().uuid(),
    submissionId: z.string().uuid(),
    navEksternRefId: z.string().regex(/^[A-Za-z0-9_-]{1,60}$/),
    filename: z.string(),
    size: z.number(),
    converted: z.boolean(),
    status: z.enum(["READY", "UNKNOWN", "MISSING"]),
});

export type DirectDocument = z.infer<typeof documentSchema>;

const base = `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api/direct`;

export class DirectUploadHttpError extends Error {
    constructor(public readonly status: number) {
        super(`Upload API returned ${status}`);
    }
}

export async function createDraft(contextId: string, fiksDigisosId: string) {
    const response = await fetch(`${base}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextId, fiksDigisosId }),
    });
    return z
        .object({ submissionId: z.string().uuid(), navEksternRefId: z.string().regex(/^[A-Za-z0-9_-]{1,60}$/) })
        .parse(await responseJson(response));
}

async function responseJson(response: Response): Promise<unknown> {
    if (!response.ok) throw new DirectUploadHttpError(response.status);
    return response.json();
}

export async function uploadFile(file: File, operationId: string, contextId: string, fiksDigisosId: string) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`${base}/uploads`, {
        method: "POST",
        headers: {
            "Upload-Operation-Id": operationId,
            "Upload-Context-Id": contextId,
            "Upload-Fiks-Digisos-Id": fiksDigisosId,
        },
        body,
    });
    const document = documentSchema.parse(await responseJson(response));
    if (document.operationId !== operationId) throw new Error("Unexpected operation ID");
    return document;
}

export async function getUpload(operationId: string) {
    const response = await fetch(`${base}/uploads/${encodeURIComponent(operationId)}`, { cache: "no-store" });
    const document = documentSchema.parse(await responseJson(response));
    if (document.operationId !== operationId) throw new Error("Unexpected operation ID");
    return document;
}

export async function listUploads(reference: string) {
    const response = await fetch(`${base}/references/${encodeURIComponent(reference)}/uploads`, { cache: "no-store" });
    return z.object({ documents: z.array(documentSchema) }).parse(await responseJson(response)).documents;
}

export async function deleteUpload(operationId: string) {
    const response = await fetch(`${base}/uploads/${encodeURIComponent(operationId)}`, { method: "DELETE" });
    if (!response.ok) throw new DirectUploadHttpError(response.status);
}
