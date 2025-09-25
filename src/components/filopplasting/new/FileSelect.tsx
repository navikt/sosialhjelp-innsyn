"use client";

import { useTranslations } from "next-intl";
import { FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";

import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { FancyFile, Error } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";

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
    const t = useTranslations();

    return (
        <FileUpload
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
                    onSelect={(_files) => addFiler(_files.map((it) => it.file))}
                    accept={allowedFileTypes}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>{outerErrors.map((it) => t(`common.${errorStatusToMessage[it.feil]}`))}</ul>
                        ) : null
                    }
                />
                {files.length > 0 && (
                    <VStack gap="2">
                        <Heading size="xsmall" level="3">
                            {filesLabel ?? t("Opplastingsboks.filerTilOpplasting")}
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

export default FileSelect;
