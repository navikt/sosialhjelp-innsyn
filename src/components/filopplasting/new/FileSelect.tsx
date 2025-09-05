"use client";

import { useTranslations } from "next-intl";
import { Box, Button, FileObject, FileUpload, Heading, HStack, Link, VStack } from "@navikt/ds-react";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { FancyFile, Error } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";
import { getTusUploader } from "@components/filopplasting/new/utils/tusUploader";
import { useDocumentState } from "@components/filopplasting/new/api/useDocumentState";
import { FilePdfIcon, TrashIcon } from "@navikt/aksel-icons";

interface Props {
    label?: string;
    description?: ReactNode;
    tag?: ReactNode;
    files: FancyFile[];
    addFiler: (files: File[]) => void;
    removeFil: (file: FancyFile) => void;
    outerErrors: Error[];
    isPending?: boolean;
}

const FileSelect = ({ label, description, tag, files, addFiler, removeFil, outerErrors, isPending }: Props) => {
    const t = useTranslations();
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    // Starter opplasting umiddelbart ved filvalg
    const onSelect = (_files: FileObject[]) => {
        const uploads = _files.map((file: FileObject) => {
            const upload = getTusUploader({
                id: fiksDigisosId,
                onProgress: (bytesSent, bytesTotal) => {
                    console.log(`${(bytesSent / bytesTotal) * 100}%`);
                },
                onSuccess: () => {
                    console.log("wahoo:", upload.url);
                },
                onUploadUrlAvailable: () => {
                    console.log("upload url available");
                },
                file,
            });
            return upload;
        });
        uploads.forEach((upload) => upload.start());
    };
    const docState = useDocumentState(fiksDigisosId);
    return (
        <FileUpload
            translations={{
                dropzone: {
                    buttonMultiple: t("Opplastingsboks.button"),
                    or: t("Opplastingsboks.eller"),
                    dragAndDropMultiple: t("Opplastingsboks.dragAndDrop"),
                },
                item: {
                    uploading: t("Opplastingsboks.uploading"),
                    deleteButtonTitle: t("Opplastingsboks.delete"),
                },
            }}
        >
            <VStack gap="6">
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={
                        <HStack justify="space-between">
                            <div>{label ?? t("Opplastingsboks.tittel")}</div>
                            {tag}
                        </HStack>
                    }
                    description={description ?? t("Opplastingsboks.beskrivelse")}
                    onSelect={onSelect}
                    accept={allowedFileTypes}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>{outerErrors.map((it) => t(`common.${errorStatusToMessage[it.feil]}`))}</ul>
                        ) : null
                    }
                />
                {docState.uploads?.map((upload) => {
                    return <FileUploadItem key={upload.originalFilename} filename={upload.originalFilename} />;
                })}
                {files.length > 0 && (
                    <VStack gap="2">
                        <Heading size="small" level="3">
                            {t("Opplastingsboks.filerTilOpplasting")}
                        </Heading>
                        <VStack as="ul" gap="2">
                            {files.map((file) => (
                                <FileUpload.Item
                                    as="li"
                                    key={file.uuid}
                                    file={file.file}
                                    button={{ action: "delete", onClick: () => removeFil(file) }}
                                    status={isPending ? "uploading" : "idle"}
                                    error={file.error ? t(`common.${errorStatusToMessage[file.error]}`) : undefined}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

interface FileUploadItemProps {
    filename: string;
}

const FileUploadItem = ({ filename }: FileUploadItemProps) => {
    return (
        <HStack
            justify="space-between"
            className="border rounded-2xl p-6"
        >
            <HStack gap="4" align="center">
                <FilePdfIcon height="32px" width="32px" />
                <Link href={`http://localhost:3007/sosialhjelp/upload/thumbnails/${filename}`}>{filename}</Link>
            </HStack>
            <Button icon={<TrashIcon height="32px" width="32px" />} size="small" variant="tertiary-neutral" />
        </HStack>
    );
};

export default FileSelect;
