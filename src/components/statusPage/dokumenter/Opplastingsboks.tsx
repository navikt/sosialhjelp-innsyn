"use client";

import { Button, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import useSendVedleggHelper from "@components/filopplasting/useSendVedleggHelper";

import useFilOpplastingApp, { errorStatusToMessage } from "../../filopplasting/useFilOpplastingApp";

const metadata = { type: "annet", tilleggsinfo: "annet" };

const Opplastingsboks = () => {
    const t = useTranslations();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { addFiler, files, removeFil, outerErrors, setOuterErrors, reset } = useFilOpplastingApp();
    const { isPending, upload } = useSendVedleggHelper(fiksDigisosId, setOuterErrors, reset);

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
                    addFiler(files.map((it) => it.file));
                }}
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
        </FileUpload>
    );
};

export default Opplastingsboks;
