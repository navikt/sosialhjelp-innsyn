import { logger } from "@navikt/next-logger";
import { Upload, UploadOptions } from "tus-js-client";
import { FileObject } from "@navikt/ds-react";
import { browserEnv } from "@config/env";

export type UploadTarget = { type: "soknad"; fiksDigisosId: string } | { type: "klage"; klageId: string };

const targetMetadata = (target: UploadTarget): Record<string, string> => {
    switch (target.type) {
        case "soknad":
            return { fiksDigisosId: target.fiksDigisosId };
        case "klage":
            return { navEksternRefId: target.klageId };
        default: {
            const ukjent: never = target;
            throw new Error(`Ukjent opplastingsmål: ${JSON.stringify(ukjent)}`);
        }
    }
};

export const getTusUploader = ({
    contextId,
    file,
    onProgress,
    onSuccess,
    onUploadUrlAvailable,
    target,
    correlationId,
}: {
    contextId: string;
    file: FileObject;
    target: UploadTarget;
    correlationId?: string;
} & Pick<UploadOptions, "onUploadUrlAvailable" | "onProgress" | "onSuccess">): Upload => {
    const uploadOptions = (file: File): UploadOptions => ({
        endpoint: `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files`,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
            filename: file.name,
            contextId: contextId,
            ...targetMetadata(target),
            ...(correlationId && { correlationId }),
            automaticCleanup: "true",
        },
        uploadSize: file.size,
        onError: (error: unknown) => logger.error(`Upload failed: ${error}`),
        onUploadUrlAvailable,
        onProgress,
        onSuccess,
    });

    return new Upload(file.file, uploadOptions(file.file));
};
