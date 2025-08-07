"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Box, Button, FileObject, FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { useParams } from "next/navigation";

import { allowedFileTypes } from "@components/filopplasting/new/consts";
import useSendVedleggHelper from "@components/filopplasting/new/mutations/useSendVedleggHelper";
import useFiles from "@components/filopplasting/new/useFiles";
import { Metadata } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: ReactNode;
    tag?: ReactNode;
    completed?: boolean;
}

const Opplastingsboks = ({ metadata, label, description, tag, completed }: Props) => {
    const t = useTranslations();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { addFiler, files, removeFil, outerErrors, reset: resetFilOpplastningData } = useFiles();
    const {
        upload,
        resetMutation,
        errors: mutationErrors,
        isPending,
        isUploadSuccess,
    } = useSendVedleggHelper(fiksDigisosId, resetFilOpplastningData);

    const onFilesSelect = (newFiles: FileObject[]) => {
        addFiler(newFiles.map((it) => it.file));
        resetMutation();
    };

    if (completed) {
        return (
            <VStack gap="2">
                <Box.New>
                    <HStack align="center" justify="space-between">
                        <Heading size="small" level="3" lang="no">
                            {label ?? t("Opplastingsboks.tittel")}
                        </Heading>
                        {tag}
                    </HStack>
                    <BodyShort>{description ?? t("Opplastingsboks.beskrivelse")}</BodyShort>
                </Box.New>
                {isUploadSuccess && (
                    <Alert closeButton onClose={resetMutation} variant="success">
                        {t("common.vedlegg.suksess")}
                    </Alert>
                )}
            </VStack>
        );
    }

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
                    onSelect={onFilesSelect}
                    accept={allowedFileTypes}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>{outerErrors.map((it) => t(`common.${errorStatusToMessage[it.feil]}`))}</ul>
                        ) : null
                    }
                />
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
                        <Button
                            disabled={Object.values(files).flat().length === 0}
                            onClick={() => upload(files, metadata)}
                            loading={isPending}
                            className="self-start"
                        >
                            {t("Opplastingsboks.sendInn")}
                        </Button>
                    </VStack>
                )}
                {isUploadSuccess && <Alert variant="success">{t("common.vedlegg.suksess")}</Alert>}
                {mutationErrors.length > 0 && (
                    <Alert variant="error">{t(`common.${errorStatusToMessage[mutationErrors[0].feil]}`)}</Alert>
                )}
            </VStack>
        </FileUpload>
    );
};

export default Opplastingsboks;
