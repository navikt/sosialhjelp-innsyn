"use client";

import { useParams } from "next/navigation";
import { Button, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { useHentVedlegg } from "../../../generated/vedlegg-controller/vedlegg-controller";
import useFilOpplastingApp, { errorStatusToMessage } from "../../filopplasting/useFilOpplastingApp";

const metadatas = [{ type: "annet", tilleggsinfo: "annet" }];

const Opplastingsboks = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useHentVedlegg(id);
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
                    <ul>
                        {Object.values(files)[0]?.map((file) => {
                            console.log(t(`common.${errorStatusToMessage[file.error!]}`));
                            return (
                                <li key={file.uuid} className="list-none">
                                    <FileUpload.Item
                                        file={file.file}
                                        button={{ action: "delete", onClick: () => removeFil(0, file) }}
                                        status={mutation.isLoading ? "uploading" : "idle"}
                                        error={file.error ? t(`common.${errorStatusToMessage[file.error]}`) : undefined}
                                    />
                                </li>
                            );
                        })}
                    </ul>
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
