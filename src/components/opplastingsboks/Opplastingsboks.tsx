"use client";

import { useTranslations } from "next-intl";
import { Button, FileUpload, Heading, VStack } from "@navikt/ds-react";

import useFilOpplastingApp, { errorStatusToMessage, Metadata } from "@components/opplastingsboks/useFilOpplastingApp";

interface Props {
    metadatas: Metadata[];
}

const Opplastingsboks = ({ metadatas }: Props) => {
    const t = useTranslations();
    const { addFiler, files, removeFil, mutation, upload, outerErrors } = useFilOpplastingApp(metadatas);

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
                onSelect={(files) => {
                    addFiler(
                        0,
                        files.map((it) => it.file)
                    );
                }}
                error={
                    outerErrors.length > 0 ? (
                        <ul>{outerErrors.map((it) => t(`common.${errorStatusToMessage[it.feil]}`))}</ul>
                    ) : null
                }
            />
            {Object.values(files).flat().length > 0 && (
                <VStack gap="2">
                    <Heading size="small" level="3">
                        {t("Opplastingsboks.filerTilOpplasting")}
                    </Heading>
                    <VStack as="ul" gap="2">
                        {Object.values(files)[0]?.map((file) => (
                            <FileUpload.Item
                                as="li"
                                key={file.uuid}
                                file={file.file}
                                button={{ action: "delete", onClick: () => removeFil(0, file) }}
                                status={mutation.isLoading ? "uploading" : "idle"}
                                error={file.error ? t(`common.${errorStatusToMessage[file.error]}`) : undefined}
                            />
                        ))}
                    </VStack>
                    <Button
                        disabled={Object.values(files).flat().length === 0}
                        onClick={upload}
                        loading={mutation.isLoading}
                        className="self-start"
                    >
                        {t("Opplastingsboks.sendInn")}
                    </Button>
                </VStack>
            )}
        </FileUpload>
    );
};

export default Opplastingsboks;
