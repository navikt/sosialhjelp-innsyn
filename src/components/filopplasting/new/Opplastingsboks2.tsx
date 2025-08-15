"use client";

import { useTranslations } from "next-intl";
import { FileUpload, Heading, VStack } from "@navikt/ds-react";

import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { FancyFile, Error } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";

interface Props {
    files: FancyFile[];
    addFiler: (files: File[]) => void;
    removeFil: (file: FancyFile) => void;
    outerErrors: Error[];
    isPending?: boolean;
}

const Opplastingsboks = ({ files, addFiler, removeFil, outerErrors, isPending }: Props) => {
    const t = useTranslations();

    return (
        <FileUpload
            className="flex flex-col gap-4"
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
            <FileUpload.Dropzone
                label={t("Opplastingsboks.tittel")}
                description={t("Opplastingsboks.beskrivelse")}
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
        </FileUpload>
    );
};

export default Opplastingsboks;
