"use client";

import { useTranslations } from "next-intl";
import * as R from "remeda";
import { FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { ReactNode, useState } from "react";
import { getTusUploader } from "@components/filopplasting/utils/tusUploader";
import { DocumentState } from "@components/filopplasting/api/useDocumentState";

import FileUploadItem from "./FileUploadItem";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { browserEnv } from "@config/env";
import { useParams } from "next/navigation";
import useSlowProcessingWarning from "@components/filopplasting/useSlowProcessingWarning";
import { isFolder } from "@components/filopplasting/utils/validateFiles";

interface Props {
    id?: string;
    label?: string;
    description?: string;
    filesLabel?: string;
    tag?: ReactNode;
    isPending?: boolean;
    docState: DocumentState;
    uploadId: string;
    onSelect?: (files: FileObject[]) => void;
    variant?: "normal" | "warning";
}

const liveRegionIndexes = [0, 1] as const;
type LiveRegionIndex = (typeof liveRegionIndexes)[number];

const FileSelectNew = ({ label, description, tag, docState, id, filesLabel, uploadId, variant, onSelect }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const hasPendingOrProcessing = docState.uploads?.some((u) => u.status === "PENDING" || u.status === "PROCESSING");

    const [folderDropError, setFolderDropError] = useState(false);
    const [skjermleserBeskjed, setSkjermleserBeskjed] = useState<{ text: string; activeRegion: LiveRegionIndex }>({
        text: "",
        activeRegion: 0,
    });

    const showSlowProcessingWarning = useSlowProcessingWarning(hasPendingOrProcessing);

    // Bytter mellom to live-regioner slik at samme beskjed kan kunngjøres flere ganger på rad.
    // Skjermlesere leser ikke alltid opp en aria-live-region hvis tekstinnholdet er likt som sist.
    const oppdaterSkjermleserBeskjed = (text: string) => {
        setSkjermleserBeskjed(({ activeRegion }) => ({
            text,
            activeRegion: activeRegion === 0 ? 1 : 0,
        }));
    };

    // Starter opplasting umiddelbart ved filvalg
    const _onSelect = (files: FileObject[]) => {
        const [folders, valid] = R.partition(files, (f) => isFolder(f));

        setFolderDropError(folders.length > 0);

        if (valid.length === 0) return;
        oppdaterSkjermleserBeskjed(t("filLagtTil", { count: valid.length }));
        onSelect?.(valid);
        const uploads = valid.map((file: FileObject) =>
            getTusUploader({
                id: uploadId,
                file,
                fiksDigisosId,
            })
        );
        uploads.forEach((upload) => upload.start());
    };
    const converted = docState.uploads?.some(
        (upload) => !!upload.finalFilename && upload.finalFilename !== upload.originalFilename
    );

    return (
        <FileUpload
            id={id}
            translations={{
                dropzone: {
                    buttonMultiple: t("button"),
                    or: t("eller"),
                    dragAndDropMultiple: t("dragAndDrop"),
                },
                item: {
                    uploading: t("uploading"),
                    deleteButtonTitle: t("delete"),
                },
            }}
        >
            {liveRegionIndexes.map((index) => (
                <div key={index} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                    {skjermleserBeskjed.activeRegion === index ? skjermleserBeskjed.text : ""}
                </div>
            ))}
            <VStack gap="space-24">
                <FileSelectUpload
                    label={label ?? t("tittel")}
                    headerId={`header-id-${uploadId}`}
                    description={description}
                    tag={tag}
                    variant={variant === "warning" ? "warning" : "default"}
                    buttonText={t("lastOppFiler")}
                    onSelect={_onSelect}
                    currentCount={docState.uploads?.length ?? 0}
                />

                {folderDropError && (
                    <InlineStatusMessage variant="error" role="alert">
                        {t("mappeIkkeTillatt")}
                    </InlineStatusMessage>
                )}

                {!!docState.uploads?.length && (
                    <VStack gap="space-8">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("valgteFiler", { antall_filer: docState.uploads.length })}
                        </Heading>
                        {converted && (
                            <InlineStatusMessage variant="info" role="status">
                                {t("konvertert")}
                            </InlineStatusMessage>
                        )}
                        {showSlowProcessingWarning && (
                            <InlineStatusMessage variant="info" role="status">
                                {t("processingWarning")}
                            </InlineStatusMessage>
                        )}
                        {(docState.validations?.length ?? 0) > 0 && (
                            <>
                                {docState.validations?.map((error) => (
                                    <InlineStatusMessage key={error} variant="error" role="alert">
                                        {t(`submissionError.${error}`)}
                                    </InlineStatusMessage>
                                ))}
                            </>
                        )}
                        <VStack as="ul" gap="space-8">
                            {docState.uploads?.map((upload) => (
                                <FileUploadItem
                                    key={upload.id}
                                    url={
                                        upload.url
                                            ? `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api${upload.url}`
                                            : undefined
                                    }
                                    uploadId={upload.id}
                                    convertedFilename={upload.finalFilename}
                                    originalFilename={upload.originalFilename}
                                    validations={upload.validations}
                                    status={upload.status}
                                    size={upload.size}
                                    showCancelButton={
                                        showSlowProcessingWarning &&
                                        (upload.status === "PENDING" || upload.status === "PROCESSING")
                                    }
                                    onTerminate={() =>
                                        oppdaterSkjermleserBeskjed(
                                            t("filSlettet", { count: (docState.uploads?.length ?? 1) - 1 })
                                        )
                                    }
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default FileSelectNew;
