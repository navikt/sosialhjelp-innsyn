"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyLong, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "@components/filopplasting/types";
import { UploadMode, useDocumentState } from "@components/filopplasting/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/api/useSendVedleggHelperTus";
import OpplastingsboksContent from "@components/filopplasting/OpplastingsboksContent";
import VedleggListe from "@components/filopplasting/VedleggListe";
import useIsMobile from "@utils/useIsMobile";
import { useGetVedleggForOppgave } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { umamiCustomTrack } from "../../app/umami";

interface Props {
    metadata: Metadata;
    label?: string | null;
    description?: string | null;
    tag?: ReactNode;
    completed?: boolean;
    uploadContextId: string;
    variant?: "normal" | "warning";
    mode?: UploadMode;
}

const OpplastingsboksTus = ({
    metadata,
    label,
    description,
    tag,
    completed,
    uploadContextId,
    variant,
    mode = "tus",
}: Props) => {
    const t = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { data: oppgaveVedlegg } = useGetVedleggForOppgave(fiksDigisosId, metadata.hendelsereferanse!, {
        query: { enabled: !!metadata.hendelsereferanse },
    });
    const {
        state: docState,
        resetState,
        addUploads,
        removeUpload,
        hasFiles,
        canSubmit,
        uploadResult,
        refresh,
    } = useDocumentState(uploadContextId, { mode });
    const opplastingId = useRef<string | null>(null);
    const {
        upload,
        resetMutation,
        isPending,
        isUploadSuccess,
        error: mutationError,
    } = useSendVedleggHelperTus(
        {
            dokumentKontekst: metadata.dokumentKontekst,
            type: metadata.type,
            hendelsereferanse: metadata.hendelsereferanse ?? "",
            hendelsetype: metadata.hendelsetype ?? "bruker",
            tilleggsinfo: metadata.tilleggsinfo ?? "annet",
            innsendelsesfrist: "",
        },
        async () => {
            umamiCustomTrack("opplasting fullført", {
                uploadVariant: mode === "sync" ? "sync" : "tus",
                dokumentKontekst: metadata.dokumentKontekst,
                digisosId: fiksDigisosId,
                opplastingId: opplastingId.current,
                antallDokumenter: docState.uploads?.length ?? 0,
            });
            opplastingId.current = null;
            resetState();
        }
    );

    const filesMissing = !!mutationError && "errors" in mutationError && mutationError.errors.includes("FILES_MISSING");
    useEffect(() => {
        if (mode === "sync" && filesMissing) void refresh();
    }, [mode, filesMissing, refresh]);

    if (completed) {
        return (
            <VStack gap="space-24">
                <VStack gap="space-16">
                    {isMobile && tag && <HStack>{tag}</HStack>}
                    <HStack align="center" justify="space-between">
                        <Heading size="small" level="3" lang="no">
                            {label ?? t("tittel")}
                        </Heading>
                        {!isMobile && tag}
                    </HStack>
                    <BodyLong lang="no">{description ?? t("beskrivelse")}</BodyLong>
                </VStack>
                {metadata.hendelsereferanse && (
                    <VedleggListe
                        vedlegg={oppgaveVedlegg ?? []}
                        labelledById={`oppgave-vedlegg-${metadata.hendelsereferanse}`}
                        oppgaveBeskrivelse={label}
                    />
                )}
                {isUploadSuccess && (
                    <Alert role="alert" closeButton onClose={resetMutation} variant="success">
                        {t("suksess")}
                    </Alert>
                )}
            </VStack>
        );
    }

    return (
        <OpplastingsboksContent
            fileSelectProps={{
                label,
                description,
                tag,
                docState,
                contextId: uploadContextId,
                onSelect: (files) => {
                    if (!isPending) {
                        resetMutation();
                    }
                    if (!opplastingId.current) {
                        opplastingId.current = crypto.randomUUID();
                        umamiCustomTrack("opplasting startet", {
                            uploadVariant: mode === "sync" ? "sync" : "tus",
                            dokumentKontekst: metadata.dokumentKontekst,
                            digisosId: fiksDigisosId,
                            opplastingId: opplastingId.current,
                            antallDokumenter: files.length,
                        });
                    }
                },
                target: { type: "soknad", fiksDigisosId },
                onUploadsAdded: addUploads,
                onUploadRemoved: removeUpload,
                variant,
                isPending,
                mode,
                onUploadResult: uploadResult,
                onForbidden: resetState,
            }}
            hasFiles={hasFiles}
            canSubmit={canSubmit}
            isUploadSuccess={isUploadSuccess}
            error={mutationError}
            onSubmit={() => upload(docState.submissionId!)}
            resetMutation={resetMutation}
        />
    );
};

export default OpplastingsboksTus;
