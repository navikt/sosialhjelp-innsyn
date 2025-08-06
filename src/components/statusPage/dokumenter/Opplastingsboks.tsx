"use client";

import { Button, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { getHentVedleggQueryKey, useSendVedlegg } from "@generated/vedlegg-controller/vedlegg-controller";
import {
    getHentHendelserBetaQueryKey,
    getHentHendelserQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";

import useFilOpplastingApp, {
    determineErrorType,
    errorStatusToMessage,
    Error,
    Feil,
    createMetadataFile,
    formatFilesForUpload,
} from "../../filopplasting/useFilOpplastingApp";

const metadatas = [{ type: "annet", tilleggsinfo: "annet" }];

const Opplastingsboks = () => {
    const t = useTranslations();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { addFiler, files, removeFil, outerErrors, setOuterErrors, reset } = useFilOpplastingApp(metadatas);
    const { isPending, mutate } = useSendVedlegg();
    const allFiles = useMemo(() => Object.values(files).flat(), [files]);
    const queryClient = useQueryClient();

    const upload = () => {
        //NULLSJEKK
        if (allFiles.length === 0) {
            setOuterErrors([{ feil: Feil.NO_FILES }]);
            // logger.info("Validering vedlegg feilet: Ingen filer valgt");
            // logAmplitudeEvent("Søker trykte på send vedlegg før et vedlegg har blitt lagt til");
            return;
        }

        const metadataFil = createMetadataFile(files, metadatas);

        mutate(
            {
                fiksDigisosId,
                data: {
                    files: [metadataFil, ...formatFilesForUpload(allFiles)],
                },
            },
            {
                onSuccess: async (data) => {
                    const filerData = data.flatMap((response) => response.filer);
                    // LAGE ERROR LISTE FRA DATA
                    // Flytte til useFilOpplastingApp?
                    const errors: Error[] = filerData
                        .filter((it) => it.status !== "OK")
                        .map((it) => ({ feil: determineErrorType(it.status)!, filnavn: it.filnavn }));
                    if (errors.length === 0) {
                        reset();

                        /*
                        SETTE UPLOAD SUCCESS STATE (brukt i VedleggSuccess f eks)
                        TODO: Tror ikke den skal med i ny filKomponent men dobbeltsjekke med Martin/Idun
                        const innsendelseType = data.flatMap((response) => response.hendelsetype);
                        if (
                            innsendelseType.includes("dokumentasjonEtterspurt") ||
                            innsendelseType.includes("dokumentasjonkrav") ||
                            innsendelseType.includes("soknad")
                        ) {
                            setOppgaverUploadSuccess(true);
                        }
                        if (innsendelseType.includes("bruker")) {
                            setEttersendelseUploadSuccess(true);
                        }*/

                        //INVALIDERE QUERIES
                        // TODO: Hvilke trengs?
                        await queryClient.invalidateQueries({ queryKey: getHentVedleggQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserBetaQueryKey(fiksDigisosId) });
                    }
                    setOuterErrors(errors);
                },
                onError: (error) => {
                    // logFileUploadFailedEvent("vedlegg.opplasting_feilmelding");
                    // logger.warn("Feil med opplasting av vedlegg: " + error.message);
                    if (error.message === "Mulig virus funnet") {
                        //logFileUploadFailedEvent(errorStatusToMessage[Feil.VIRUS]);
                        setOuterErrors([{ feil: Feil.VIRUS }]);
                    } else {
                        //logFileUploadFailedEvent(errorStatusToMessage[Feil.KLIENTFEIL]);
                        setOuterErrors([{ feil: Feil.KLIENTFEIL }]);
                    }
                },
            }
        );
    };

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
                                status={isPending ? "uploading" : "idle"}
                                error={file.error ? t(`common.${errorStatusToMessage[file.error]}`) : undefined}
                            />
                        ))}
                    </VStack>
                    <Button
                        disabled={Object.values(files).flat().length === 0}
                        onClick={upload}
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
