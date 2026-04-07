"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "@components/filopplasting/types";
import { useDocumentState } from "@components/filopplasting/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/api/useSendVedleggHelperTus";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import VedleggListe from "../../app/[locale]/soknad/[id]/_components/dokumenter/VedleggListe";
import useIsMobile from "@utils/useIsMobile";
import { useGetVedleggForOppgave } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: string;
    tag?: ReactNode;
    completed?: boolean;
    id: string;
}

const OpplastingsboksTus = ({ metadata, label, description, tag, completed, id }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { data: oppgaveVedlegg } = useGetVedleggForOppgave(fiksDigisosId, metadata.hendelsereferanse!, {
        query: { enabled: !!metadata.hendelsereferanse },
    });
    const docState = useDocumentState(id);
    const {
        upload,
        resetMutation,
        isPending,
        isUploadSuccess,
        error: mutationError,
    } = useSendVedleggHelperTus(metadata);
    const liveRegionRef = useRef<HTMLDivElement>(null);

    // Move focus to live region when upload completes to prevent "leaving main content" announcement
    useEffect(() => {
        if (isUploadSuccess && liveRegionRef.current) {
            liveRegionRef.current.focus();
        }
    }, [isUploadSuccess]);

    if (completed) {
        return (
            <VStack gap="space-24">
                <VStack gap="space-8">
                    {isMobile && tag}
                    <HStack align="center" justify="space-between">
                        <Heading size="small" level="3" lang="no">
                            {label ?? t("tittel")}
                        </Heading>
                        {!isMobile && tag}
                    </HStack>
                    <BodyShort>{description ?? t("beskrivelse")}</BodyShort>
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
        <>
            <FileSelectNew label={label} description={description} tag={tag} docState={docState} uploadId={id} />
            {!!docState.uploads?.length && (
                <Button
                    onClick={() => upload(docState.documentId!)}
                    loading={isPending}
                    className="self-start mt-4"
                    disabled={
                        isPending ||
                        docState.uploads?.some((upload) => (upload.validations?.length ?? 0) > 0 || !upload.signedUrl)
                    }
                >
                    {t("sendInn")}
                </Button>
            )}
            {isUploadSuccess && (
                <Alert role="alert" variant="success">
                    {t("suksess")}
                </Alert>
            )}
            {mutationError && (
                <Alert role="alert" variant="error">
                    {t("error")}
                </Alert>
            )}
        </>
    );
};

export default OpplastingsboksTus;
