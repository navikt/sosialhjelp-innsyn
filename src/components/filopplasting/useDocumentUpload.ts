import { FileObject } from "@navikt/ds-react";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { UploadState } from "./api/useDocumentState";
import { useTranslations } from "next-intl";
import { Upload } from "tus-js-client";
import { browserEnv } from "@config/env";
import { getTusUploader, type UploadTarget } from "./utils/tusUploader";

export const useDocumentUpload = ({
    contextId,
    onUploadRemoved,
    setFolderDropError,
    oppdaterSkjermleserBeskjed,
    onUploadsAdded,
    onSelect,
    target,
}: {
    contextId: string;
    onUploadRemoved: (correlationId: string) => void;
    setFolderDropError: (error: boolean) => void;
    oppdaterSkjermleserBeskjed: (text: string) => void;
    onUploadsAdded: (uploads: UploadState[]) => void;
    onSelect?: (files: FileObject[]) => void;
    target: UploadTarget;
}) => {
    const t = useTranslations("Opplastingsboks");

    const startUpload = (files: FileObject[]) => {
        const [folders, validFiles] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (validFiles.length === 0) return;
        oppdaterSkjermleserBeskjed(t("filLagtTil", { count: validFiles.length }));
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
    };

    const terminateUpload = async (tusUploadId: string, correlationId?: string) => {
        await Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${tusUploadId}`, {});
        if (correlationId) onUploadRemoved(correlationId);
    };

    return { startUpload, terminateUpload };
};
