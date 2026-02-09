"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Box, Button, FileObject, FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useNavigationGuard } from "next-navigation-guard";
import { allowedFileTypes } from "@components/filopplasting/new/consts";
import useSendVedleggHelper from "@components/filopplasting/new/api/useSendVedleggHelper";
import useFiles from "@components/filopplasting/new/useFiles";
import { Metadata } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";
import UploadedFileList from "@components/filopplasting/new/UploadedFileList";

import { umamiTrack } from "../../../app/umami";

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
        feedbackRef,
    } = useSendVedleggHelper(fiksDigisosId, resetFilOpplastningData);
    const liveRegionRef = useRef<HTMLDivElement>(null);

    useNavigationGuard({
        enabled: files.length > 0,
        confirm: () => {
            return window.confirm(t("common.varsling.forlater_siden_uten_aa_sende_inn_vedlegg"));
        },
    });

    // Move focus to live region when upload completes to prevent "leaving main content" announcement
    useEffect(() => {
        if (isUploadSuccess && liveRegionRef.current) {
            liveRegionRef.current.focus();
        }
    }, [isUploadSuccess]);

    const onFilesSelect = (newFiles: FileObject[]) => {
        umamiTrack("knapp klikket", {
            tekst: "Last opp",
            antallDokumenter: newFiles.length,
            dokumentKontekst: metadata.dokumentKontekst,
            digisosId: fiksDigisosId,
        });
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
                <UploadedFileList fiksDigisosId={fiksDigisosId} oppgaveId={metadata.hendelsereferanse} />
                <div ref={feedbackRef} tabIndex={-1}>
                    {isUploadSuccess && (
                        <Alert role="alert" aria-live="assertive" closeButton onClose={resetMutation} variant="success">
                            {t("common.vedlegg.suksess")}
                        </Alert>
                    )}
                </div>
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
                            <ul>
                                {outerErrors.map((it) => (
                                    <li key={it.feil}>{t(`common.${errorStatusToMessage[it.feil]}`)}</li>
                                ))}
                            </ul>
                        ) : null
                    }
                />
                {files.length > 0 && (
                    <VStack gap="2">
                        <Heading size="small" level="3">
                            {t("Opplastingsboks.filerTilOpplasting")}
                        </Heading>
                        <div role="status" aria-live="polite" className="sr-only">
                            {t("Opplastingsboks.antallFiler", { count: files.length })}
                        </div>
                        <VStack as="ul" gap="2" aria-live="polite" aria-relevant="additions removals">
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
                            onClick={() => {
                                umamiTrack("knapp klikket", {
                                    tekst: "Send dokumentasjon",
                                    antallDokumenter: files.length,
                                    dokumentKontekst: metadata.dokumentKontekst,
                                    digisosId: fiksDigisosId,
                                });
                                upload(files, metadata);
                            }}
                            loading={isPending}
                            className="self-start"
                        >
                            {t("Opplastingsboks.sendInn")}
                        </Button>
                    </VStack>
                )}
                <div ref={feedbackRef} tabIndex={-1}>
                    {isUploadSuccess && (
                        <Alert role="alert" aria-live="assertive" variant="success">
                            {t("common.vedlegg.suksess")}
                        </Alert>
                    )}
                    {mutationErrors.length > 0 && (
                        <Alert role="alert" aria-live="assertive" variant="error">
                            {t(`common.${errorStatusToMessage[mutationErrors[0].feil]}`)}
                        </Alert>
                    )}
                </div>
            </VStack>
        </FileUpload>
    );
};

export default Opplastingsboks;
