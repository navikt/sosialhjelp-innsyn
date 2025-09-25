import { logger } from "@navikt/next-logger";
import { Upload, UploadOptions } from "tus-js-client";
import { FileObject } from "@navikt/ds-react";

import { browserEnv } from "@config/env";

export const getTusUploader = ({
    id,
    file,
    onProgress,
    onSuccess,
    onUploadUrlAvailable,
}: {
    id: string;
    file: FileObject;
} & Pick<UploadOptions, "onUploadUrlAvailable" | "onProgress" | "onSuccess">): Upload => {
    const uploadOptions = (file: File): UploadOptions => ({
        endpoint: browserEnv.NEXT_PUBLIC_TUSD_URL,
        retryDelays: [0, 1000, 3000, 5000],
        chunkSize: 150 * 1024 * 1024, // 150MB
        metadata: {
            filename: file.name,
            externalId: id,
        },
        uploadSize: file.size,
        onError: (error: unknown) => logger.error(`Upload failed: ${error}`),
        // uploadId kan deriveres fra URL, så vi bruker denne som en callback for en primærnøkkel
        onUploadUrlAvailable,
        onProgress,
        onSuccess,
    });

    return new Upload(file.file, uploadOptions(file.file));
};
