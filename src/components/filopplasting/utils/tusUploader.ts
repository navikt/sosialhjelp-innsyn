import { logger } from "@navikt/next-logger";
import { Upload, UploadOptions } from "tus-js-client";
import { FileObject } from "@navikt/ds-react";
import { browserEnv } from "@config/env";

export const uploadFile = (args: Parameters<typeof getTusUploader>[0]): Promise<void> =>
    new Promise((resolve, reject) => {
        getTusUploader({
            ...args,
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
        }).start();
    });

export const getTusUploader = ({
    id,
    file,
    onProgress,
    onSuccess,
    onUploadUrlAvailable,
    onError,
    fiksDigisosId,
}: {
    id: string;
    file: FileObject;
    fiksDigisosId: string;
} & Pick<UploadOptions, "onUploadUrlAvailable" | "onProgress" | "onSuccess" | "onError">): Upload => {
    const uploadOptions = (file: File): UploadOptions => ({
        endpoint: `${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files`,
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
            filename: file.name,
            contextId: id,
            fiksDigisosId,
        },
        uploadSize: file.size,
        onError: (error) => {
            logger.error(`Upload failed: ${error}`);
            onError?.(error);
        },
        onUploadUrlAvailable,
        onProgress,
        onSuccess,
    });

    return new Upload(file.file, uploadOptions(file.file));
};
