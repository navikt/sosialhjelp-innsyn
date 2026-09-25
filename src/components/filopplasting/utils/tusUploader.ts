import { logger } from "@navikt/next-logger";
import { Upload, UploadOptions } from "tus-js-client";
import { FileObject } from "@navikt/ds-react";
import { browserEnv } from "@config/env";

export const getTusUploader = ({
    contextId,
    file,
    onProgress,
    onSuccess,
    onUploadUrlAvailable,
    fiksDigisosId,
    correlationId,
}: {
    contextId: string;
    file: FileObject;
    fiksDigisosId: string;
    correlationId?: string;
} & Pick<UploadOptions, "onUploadUrlAvailable" | "onProgress" | "onSuccess">): Upload => {
    const uploadOptions = (file: File): UploadOptions => ({
        endpoint: `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files`,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
            filename: file.name,
            contextId: contextId,
            fiksDigisosId,
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

export const getKlageTusUploader = ({
    contextId,
    file,
    onProgress,
    onSuccess,
    onUploadUrlAvailable,
    klageId,
    correlationId,
}: {
    contextId: string;
    file: FileObject;
    klageId: string;
    correlationId?: string;
} & Pick<UploadOptions, "onUploadUrlAvailable" | "onProgress" | "onSuccess">): Upload => {
    const uploadOptions = (file: File): UploadOptions => ({
        endpoint: `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files`,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
            filename: file.name,
            contextId: contextId,
            navEksternRefId: klageId,
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
