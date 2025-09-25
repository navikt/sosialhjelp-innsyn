"use client";

import { useTranslations } from "next-intl";
import {
    Alert,
    BodyShort,
    Button,
    FileObject,
    FileUpload,
    Heading,
    HStack,
    Link,
    List,
    VStack,
} from "@navikt/ds-react";
import { useParams } from "next/navigation";
import { ReactNode, useRef } from "react";
import cx from "classnames";
import { ExclamationmarkTriangleFillIcon, FilePdfIcon, TrashIcon } from "@navikt/aksel-icons";
import dynamic from "next/dynamic";
import { Upload } from "tus-js-client";
import { useMutation } from "@tanstack/react-query";

import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { Error } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";
import { getTusUploader } from "@components/filopplasting/new/utils/tusUploader";
import { DocumentState, ValidationCode } from "@components/filopplasting/new/api/useDocumentState";
import { browserEnv } from "@config/env";

interface Props {
    id?: string;
    label?: string;
    description?: ReactNode;
    filesLabel?: string;
    tag?: ReactNode;
    outerErrors: Error[];
    isPending?: boolean;
    docState: DocumentState;
}

const FileSelect = ({ label, description, tag, outerErrors, docState, id, filesLabel }: Props) => {
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
    const converted = docState.uploads?.some((upload) => upload.convertedFilename);
    return (
        <FileUpload
            id={id}
            className="mb-4"
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
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    disabled={(docState.uploads?.length ?? 0) >= 30}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>{outerErrors.map((it) => t(`common.${errorStatusToMessage[it.feil]}`))}</ul>
                        ) : null
                    }
                />
                {docState.uploads?.length !== 0 && (
                    <VStack gap="2">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("Opplastingsboks.filerTilOpplasting")}
                        </Heading>
                        {converted && (
                            <Alert variant="warning">
                                <HStack gap="2">
                                    <Heading size="small" level="4">
                                        Noen filer kan ha blitt forandret
                                    </Heading>
                                    <BodyShort>
                                        Enkelte filer kan ha blitt konvertert fordi det originale filformatet ikke
                                        støttes. Du må se gjennom og godkjenne filene før du kan fortsette.
                                    </BodyShort>
                                </HStack>
                            </Alert>
                        )}
                        <VStack as="ul" gap="2">
                            {docState.uploads?.map((upload) => (
                                <FileUploadItem
                                    key={upload.originalFilename}
                                    url={upload.signedUrl}
                                    uploadId={upload.id}
                                    filename={upload.convertedFilename}
                                    originalFilename={upload.originalFilename}
                                    validations={upload.validations}
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
    originalFilename: string;
    filename?: string;
    uploadId: string;
    validations?: ValidationCode[];
    url?: string;
}

const FilePreviewModal = dynamic(() => import("./preview/FilePreviewModal"), { ssr: false });

const validationToMessage: Record<ValidationCode, string> = {
    ENCRYPTED_PDF: "Fjern passord a, idiot",
    FILETYPE_NOT_SUPPORTED: "Du kanke laste opp denne filtypen",
    FILE_TOO_LARGE: "Fila er for stor. 10MB max pls",
    INVALID_FILENAME: "Hvorfor har du så sjuke tegn i filnavnet ditt",
    INVALID_PDF: "Det er no gærnt med pdfen din",
    POSSIBLY_INFECTED: "IKKE SEND OSS VIRUS, DIN DRITT",
};

const FileUploadItem = ({ filename, originalFilename, uploadId, validations, url }: FileUploadItemProps) => {
    const ref = useRef<HTMLDialogElement>(null);
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_TUSD_URL}/${uploadId}`),
        retry: false,
    });
    return (
        <>
            <HStack
                as="li"
                justify="space-between"
                className={cx("border rounded-2xl p-6", {
                    "border-ax-border-warning-subtle": filename,
                    "border-ax-border-danger": validations?.length,
                })}
            >
                <VStack justify="center">
                    <HStack gap="4" align="center" wrap={false}>
                        <FilePdfIcon height="32px" width="32px" />
                        <Link onClick={() => ref.current?.showModal()} className="overflow-ellipsis">
                            {originalFilename}
                        </Link>
                    </HStack>
                    {filename && (
                        <HStack align="center" gap="2" className="text-ax-text-warning-subtle">
                            <ExclamationmarkTriangleFillIcon />
                            <BodyShort>Vennligst se over at innholdet i filen er leselig.</BodyShort>
                        </HStack>
                    )}
                    {validations?.length && (
                        <List>
                            {validations.map((val) => (
                                <List.Item key={val} className="text-ax-text-warning-subtle">
                                    {validationToMessage[val]}
                                </List.Item>
                            ))}
                        </List>
                    )}
                </VStack>
                <Button
                    icon={<TrashIcon height="32px" width="32px" />}
                    size="small"
                    loading={isPending}
                    variant="tertiary-neutral"
                    onClick={() => mutate()}
                />
            </HStack>
            {url && (
                <FilePreviewModal
                    ref={ref}
                    onClose={() => ref.current?.close()}
                    filename={originalFilename}
                    url={url}
                />
            )}
        </>
    );
};

export default FileSelect;
