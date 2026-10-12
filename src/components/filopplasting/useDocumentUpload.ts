import { FileObject } from "@navikt/ds-react";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { DocumentState, UploadState } from "./api/useDocumentState";
import { useTranslations } from "next-intl";
import { Upload } from "tus-js-client";
import { browserEnv } from "@config/env";
import { getTusUploader, type UploadTarget } from "./utils/tusUploader";
import { useState } from "react";

export const liveRegionIndexes = [0, 1] as const;
type LiveRegionIndex = (typeof liveRegionIndexes)[number];

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
    const [skjermleserBeskjed, setSkjermleserBeskjed] = useState<{ text: string; activeRegion: LiveRegionIndex }>({
        text: "",
        activeRegion: 0,
    });

    // Bytter mellom to live-regioner slik at samme beskjed kan kunngjøres flere ganger på rad.
    // Skjermlesere leser ikke alltid opp en aria-live-region hvis tekstinnholdet er likt som sist.
    const oppdaterSkjermleserBeskjed = (text: string) => {
        setSkjermleserBeskjed(({ activeRegion }) => ({
            text,
            activeRegion: activeRegion === 0 ? 1 : 0,
        }));
    };

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
        await Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${tusUploadId}`);
        oppdaterSkjermleserBeskjed(t("filSlettet", { count: (docState.uploads?.length ?? 1) - 1 }));
        if (correlationId) onUploadRemoved(correlationId);
    };

    return { startUpload, terminateUpload, folderDropError, skjermleserBeskjed };
};
