"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyLong, Button, FileObject, FileUpload, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useNavigationGuard } from "next-navigation-guard";
import useSendVedleggHelper from "@components/filopplasting/api/useSendVedleggHelper";
import useFiles from "@components/filopplasting/useFiles";
import { Metadata } from "@components/filopplasting/types";
import useIsMobile from "@utils/useIsMobile";
import { errorStatusToMessage } from "@components/filopplasting/utils/mapErrors";
import VedleggListe from "../../app/[locale]/soknad/[id]/_components/dokumenter/VedleggListe";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { umamiTrack } from "../../app/umami";
import { useGetVedleggForOppgave } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

interface Props {
    metadata: Metadata;
    label?: ReactNode;
    labelText?: string;
    description?: ReactNode;
    tag?: ReactNode;
    completed?: boolean;
}

const Opplastingsboks = ({ metadata, label, labelText, description, tag, completed }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { data: oppgaveVedlegg } = useGetVedleggForOppgave(fiksDigisosId, metadata.hendelsereferanse!, {
        query: { enabled: !!metadata.hendelsereferanse },
    });
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
            return window.confirm(t("forlater_siden_uten_aa_sende_inn_vedlegg"));
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
            <VStack gap="space-24">
                <VStack gap="space-16">
                    {isMobile && <HStack>{tag}</HStack>}
                    <VStack gap="space-4">
                        <HStack align="center" justify="space-between">
                            {label ? (
                                <Heading size="small" level="3" lang="no">
                                    {label}
                                </Heading>
                            ) : (
                                <Heading size="small" level="3">
                                    {t("tittel")}
                                </Heading>
                            )}
                            {!isMobile && tag}
                        </HStack>
                        {description && <BodyLong>{description}</BodyLong>}
                    </VStack>
                </VStack>
                {metadata.hendelsereferanse && (
                    <VedleggListe
                        vedlegg={oppgaveVedlegg ?? []}
                        labelledById={`oppgave-vedlegg-${metadata.hendelsereferanse}`}
                        oppgaveBeskrivelse={labelText}
                    />
                )}
                <div ref={feedbackRef} tabIndex={-1} aria-live="polite" className={isUploadSuccess ? "" : "contents"}>
                    {isUploadSuccess && (
                        <Alert role="alert" aria-live="assertive" closeButton onClose={resetMutation} variant="success">
                            {t("suksess")}
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
                        label ? (
                            <Heading size="small" level="3" lang="no">
                                {label}
                            </Heading>
                        ) : isMobile ? undefined : (
                            t("tittel")
                        )
                    }
                    description={
                        description ? (
                            <HStack justify="space-between">
                                <BodyLong>{description}</BodyLong>
                            </HStack>
                        ) : undefined
                    }
                    tag={tag}
                    buttonText={t("lastOppFiler")}
                    onSelect={onFilesSelect}
                    error={
                        outerErrors.length > 0 ? (
                            <ul>
                                {outerErrors.map((it) => (
                                    <li key={it.feil}>{t(errorStatusToMessage[it.feil])}</li>
                                ))}
                            </ul>
                        ) : null
                    }
                />
                {files.length > 0 && (
                    <VStack gap="space-16">
                        <VStack gap="space-4">
                            <Heading size="small" level="3">
                                {t("valgteFiler", { antall_filer: files.length })}
                            </Heading>
                            <div role="status" aria-live="polite" className="sr-only">
                                {t("antallFiler", { count: files.length })}
                            </div>
                            <VStack as="ul" gap="space-8" aria-live="polite" aria-relevant="additions removals">
                                {files.map((file) => (
                                    <FileUpload.Item
                                        as="li"
                                        key={file.uuid}
                                        file={file.file}
                                        button={{ action: "delete", onClick: () => removeFil(file) }}
                                        status={isPending ? "uploading" : "idle"}
                                        error={
                                            file.error !== undefined ? t(errorStatusToMessage[file.error]) : undefined
                                        }
                                    />
                                ))}
                            </VStack>
                        </VStack>
                        <Button
                            disabled={isPending || Object.values(files).flat().length === 0}
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
                            {t("sendInn")}
                        </Button>
                    </VStack>
                )}
                <div
                    ref={feedbackRef}
                    tabIndex={-1}
                    className={!(isUploadSuccess || mutationErrors.length > 0) ? "contents" : ""}
                >
                    {isUploadSuccess && (
                        <Alert closeButton onClose={resetMutation} role="alert" aria-live="assertive" variant="success">
                            {t("suksess")}
                        </Alert>
                    )}
                    {mutationErrors.length > 0 && (
                        <Alert role="alert" aria-live="assertive" variant="error">
                            {t(errorStatusToMessage[mutationErrors[0].feil])}
                        </Alert>
                    )}
                </div>
            </VStack>
        </FileUpload>
    );
};

export default Opplastingsboks;
