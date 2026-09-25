import { FileObject } from "@navikt/ds-react";
import { isFolder } from "./utils/validateFiles";
import * as R from "remeda";
import { UploadState } from "./api/useDocumentState";
import { getKlageTusUploader, getTusUploader } from "./utils/tusUploader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Upload } from "tus-js-client";
import { browserEnv } from "@config/env";

export const useDocumentUpload = (
    contextId: string,
    onUploadRemoved: (correlationId: string) => void,
    klageId?: string
) => {
    const t = useTranslations("Opplastingsboks");
    const isKlage = !!klageId;
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const startUpload = (
        files: FileObject[],
        setFolderDropError: (error: boolean) => void,
        oppdaterSkjermleserBeskjed: (text: string) => void,
        onUploadsAdded: (uploads: UploadState[]) => void,
        onSelect?: (files: FileObject[]) => void
    ) => {
        const [folders, valid] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (valid.length === 0) return;
        oppdaterSkjermleserBeskjed(t("filLagtTil", { count: valid.length }));
        onSelect?.(valid);

        const optimisticUploads: UploadState[] = valid.map((file: FileObject) => {
            const correlationId = crypto.randomUUID();
            const upload = isKlage
                ? getKlageTusUploader({
                      contextId,
                      file,
                      klageId: klageId,
                      correlationId,
                  })
                : getTusUploader({
                      contextId,
                      file,
                      fiksDigisosId,
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
