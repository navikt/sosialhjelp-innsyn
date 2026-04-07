"use client";

import { useTranslations } from "next-intl";
import { BodyShort, FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";
import { FancyFile, Error } from "@components/filopplasting/types";
import { errorStatusToMessage } from "@components/filopplasting/utils/mapErrors";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";

interface Props {
    id?: string;
    label?: string;
    description?: React.ReactNode;
    filesLabel?: string;
    tag?: React.ReactNode;
    files: FancyFile[];
    addFiler: (files: File[]) => void;
    removeFil: (file: FancyFile) => void;
    outerErrors: Error[];
    isPending?: boolean;
}

const FileSelect = ({
    id,
    label,
    description,
    filesLabel,
    tag,
    files,
    addFiler,
    removeFil,
    outerErrors,
    isPending,
}: Props) => {
    const t = useTranslations("Opplastingsboks");

    return (
        <FileUpload
            id={id}
            className="mb-4"
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
            <VStack gap="space-24">
                <FileSelectUpload
                    label={
                        <HStack justify="space-between">
                            {label ? (
                                <BodyShort as="span" lang="no">
                                    {label}
                                </BodyShort>
                            ) : (
                                t("tittel")
                            )}
                            {tag}
                        </HStack>
                    }
                    description={description ?? t("beskrivelse")}
                    buttonText={t("lastOppFiler")}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>{outerErrors.map((it) => t(errorStatusToMessage[it.feil]))}</ul>
                        ) : null
                    }
                    onSelect={(_files) => addFiler(_files.map((it) => it.file))}
                />

                {files.length > 0 && (
                    <VStack gap="space-8">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("valgteFiler", { antall_filer: files.length })}
                        </Heading>
                        <VStack as="ul" gap="space-8">
                            {files.map((file) => (
                                <FileUpload.Item
                                    as="li"
                                    key={file.uuid}
                                    file={file.file}
                                    button={{ action: "delete", onClick: () => removeFil(file) }}
                                    status={isPending ? "uploading" : "idle"}
                                    error={file.error ? t(errorStatusToMessage[file.error]) : undefined}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default FileSelect;
