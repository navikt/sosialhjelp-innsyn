"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyLong, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "@components/filopplasting/types";
import { useDocumentState } from "@components/filopplasting/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/api/useSendVedleggHelperTus";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import UploadAnnouncements, {
    UploadAnnouncement,
    UploadAnnouncementEvent,
} from "@components/filopplasting/UploadAnnouncements";
import VedleggListe from "@components/filopplasting/VedleggListe";
import useIsMobile from "@utils/useIsMobile";
import { useGetVedleggForOppgave } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { PaperplaneIcon, XMarkIcon } from "@navikt/aksel-icons";
import { umamiCustomTrack } from "../../app/umami";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: string;
    tag?: ReactNode;
    completed?: boolean;
    uploadContextId: string;
    variant?: "normal" | "warning";
}

const OpplastingsboksTus = ({ metadata, label, description, tag, completed, uploadContextId, variant }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { data: oppgaveVedlegg } = useGetVedleggForOppgave(fiksDigisosId, metadata.hendelsereferanse!, {
        query: { enabled: !!metadata.hendelsereferanse },
    });
    const { state: docState, resetState, addUploads, removeUpload } = useDocumentState(uploadContextId);
    const opplastingId = useRef<string | null>(null);

    // --- Skjermleser-kunngjøringer ---
    // announce() bruker 400ms delay for å unngå konflikt med fokusretur etter native
    // filvelger-dialog lukkes. Uten delay dropper VoiceOver + Firefox live-region-mutasjoner
    // fordi fokusretur og live-region-oppdatering skjer samtidig.
    // key-mønsteret i UploadAnnouncements sikrer at identisk tekst to ganger på rad
    // alltid leses opp (ny DOM-node, ikke bare tekstendring).
    const [announcement, setAnnouncement] = useState<UploadAnnouncement | undefined>();
    const announcementIdRef = useRef(0);
    const announceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        return () => clearTimeout(announceTimerRef.current);
    }, []);

    const announce = (event: UploadAnnouncementEvent, delay = 400) => {
        clearTimeout(announceTimerRef.current);
        announceTimerRef.current = setTimeout(() => {
            announcementIdRef.current += 1;
            setAnnouncement({ id: announcementIdRef.current, ...event });
        }, delay);
    };
    // ---

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
                uploadVariant: "tus",
                dokumentKontekst: metadata.dokumentKontekst,
                digisosId: fiksDigisosId,
                opplastingId: opplastingId.current,
                antallDokumenter: docState.uploads?.length ?? 0,
            });
            opplastingId.current = null;
            resetState();
        }
    );

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
        <VStack gap="space-8">
            <UploadAnnouncements announcement={announcement} />
            <FileSelectNew
                label={label}
                description={description}
                tag={tag}
                docState={docState}
                uploadId={uploadContextId}
                onFilesSelected={(count) => {
                    announce({ type: "files-selected", count });
                }}
                onFileDeleted={(remainingCount) => {
                    announce({ type: "file-deleted", remainingCount }, 0);
                }}
                onSelect={(files) => {
                    resetMutation();
                    if (!opplastingId.current) {
                        opplastingId.current = crypto.randomUUID();
                        umamiCustomTrack("opplasting startet", {
                            uploadVariant: "tus",
                            dokumentKontekst: metadata.dokumentKontekst,
                            digisosId: fiksDigisosId,
                            opplastingId: opplastingId.current,
                            antallDokumenter: files.length,
                        });
                    }
                }}
                onUploadsAdded={addUploads}
                onUploadRemoved={removeUpload}
                variant={variant}
                isPending={isPending}
            />
            {mutationError && (
                <InlineStatusMessage variant="error" padding="large" fullWidth>
                    <HStack justify="space-between" align="start" wrap={false}>
                        <BodyLong>{t("error")}</BodyLong>
                        <Button
                            icon={<XMarkIcon aria-hidden />}
                            size="small"
                            onClick={resetMutation}
                            data-color="neutral"
                            variant="tertiary-neutral"
                        />
                    </HStack>
                </InlineStatusMessage>
            )}
            {!!docState.uploads?.length && (
                <Button
                    onClick={() => upload(docState.submissionId!)}
                    loading={isPending}
                    className="self-start"
                    disabled={
                        isPending ||
                        docState.uploads?.some((upload) => (upload.validations?.length ?? 0) > 0 || !upload.filId) ||
                        (docState.validations?.length ?? 0) > 0
                    }
                    icon={<PaperplaneIcon />}
                    iconPosition={"right"}
                >
                    {t("sendInn")}
                </Button>
            )}
            {isUploadSuccess && (
                <InlineStatusMessage
                    role="status"
                    variant="success"
                    padding="large"
                    size={isMobile ? "small" : "medium"}
                >
                    {t("suksess")}
                </InlineStatusMessage>
            )}
        </VStack>
    );
};

export default OpplastingsboksTus;
