import { FileObject } from "@navikt/ds-react";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { UploadState } from "./api/useDocumentState";
import { Upload } from "tus-js-client";
import { browserEnv } from "@config/env";
import { getTusUploader, type UploadTarget } from "./utils/tusUploader";
import { useState } from "react";

export const useDocumentUpload = ({
    contextId,
    onUploadRemoved,
    onUploadsAdded,
    onSelect,
    target,
}: {
    contextId: string;
    onUploadRemoved: (correlationId: string) => void;
    onUploadsAdded: (uploads: UploadState[]) => void;
    onSelect?: (files: FileObject[]) => void;
    target: UploadTarget;
}) => {
    const [folderDropError, setFolderDropError] = useState(false);

    // Returnerer antall filer som faktisk ble lagt til.
    const startUpload = (files: FileObject[]): number => {
        const [folders, validFiles] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (validFiles.length === 0) return 0;

        onSelect?.(validFiles);

        const optimisticUploads: UploadState[] = validFiles.map((file: FileObject) => {
            const correlationId = crypto.randomUUID();
            const upload = getTusUploader({
                contextId,
                file,
                target,
                correlationId,
            });
            upload.start();
            return {
                id: correlationId,
                correlationId,
                converted: false,
                originalFilename: file.file.name,
                size: file.file.size,
                status: "PENDING" as const,
            } satisfies UploadState;
        });
        onUploadsAdded(optimisticUploads);
        return validFiles.length;
    };

    const terminateUpload = async (tusUploadId: string, correlationId?: string) => {
        await Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${tusUploadId}`);
        if (correlationId) onUploadRemoved(correlationId);
    };

    return { startUpload, terminateUpload, folderDropError };
};
