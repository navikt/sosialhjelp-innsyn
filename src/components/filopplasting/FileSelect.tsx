"use client";

import { useTranslations } from "next-intl";
import { FileUpload, Heading, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { FancyFile, Error } from "@components/filopplasting/types";
import { errorStatusToMessage } from "@components/filopplasting/utils/mapErrors";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";

interface Props {
    id?: string;
    label?: string;
    description?: ReactNode;
    filesLabel?: string;
    tag?: ReactNode;
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
                    label={label ?? t("tittel")}
                    description={description ?? t("beskrivelse")}
                    tag={tag}
                    buttonText={t("lastOppFiler")}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>{outerErrors.map((it) => t(errorStatusToMessage[it.feil]))}</ul>
                        ) : null
                    }
                    onSelect={(_files) => addFiler(_files.map((it) => it.file))}
                    currentCount={files.length}
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
