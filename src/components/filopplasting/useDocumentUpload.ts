import { FileObject } from "@navikt/ds-react";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { DocumentState, UploadState } from "./api/useDocumentState";
import { useTranslations } from "next-intl";
import { Upload } from "tus-js-client";
import { browserEnv } from "@config/env";
import { getTusUploader, type UploadTarget } from "./utils/tusUploader";
import { useState } from "react";
import { useAnnounce } from "@components/liveAnnouncer/LiveAnnouncer";

// Filvelgeren er nettopp lukket, så vi venter til fokus er returnert før vi kunngjør.
const FILE_DIALOG_CLOSE_DELAY_MS = 200;

export const useDocumentUpload = ({
    contextId,
    docState,
    onUploadRemoved,
    onUploadsAdded,
    onSelect,
    target,
}: {
    contextId: string;
    docState: DocumentState;
    onUploadRemoved: (correlationId: string) => void;
    onUploadsAdded: (uploads: UploadState[]) => void;
    onSelect?: (files: FileObject[]) => void;
    target: UploadTarget;
}) => {
    const t = useTranslations("Opplastingsboks");
    const [folderDropError, setFolderDropError] = useState(false);
    const announce = useAnnounce();

    const startUpload = (files: FileObject[]) => {
        const [folders, validFiles] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (validFiles.length === 0) return;

        announce(t("filLagtTil", { count: validFiles.length }), FILE_DIALOG_CLOSE_DELAY_MS);
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

    // onBeforeRemove kalles rett før raden fjernes, slik at fokus kan flyttes før elementet forsvinner fra DOM.
    const terminateUpload = async (tusUploadId: string, correlationId?: string, onBeforeRemove?: () => void) => {
        await Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${tusUploadId}`);
        announce(t("filSlettet", { count: (docState.uploads?.length ?? 1) - 1 }));
        onBeforeRemove?.();
        if (correlationId) onUploadRemoved(correlationId);
    };

    return { startUpload, terminateUpload, folderDropError };
};
