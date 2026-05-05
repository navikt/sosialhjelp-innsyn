"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Button, Heading, HStack, InlineMessage, LocalAlert, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "@components/filopplasting/types";
import { useDocumentState } from "@components/filopplasting/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/api/useSendVedleggHelperTus";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import VedleggListe from "@components/filopplasting/VedleggListe";
import useIsMobile from "@utils/useIsMobile";
import { useGetVedleggForOppgave } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { PaperplaneIcon, XMarkIcon } from "@navikt/aksel-icons";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: string;
    tag?: ReactNode;
    completed?: boolean;
    id: string;
    variant?: "normal" | "warning";
}

const OpplastingsboksTus = ({ metadata, label, description, tag, completed, id, variant }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const isMobile = useIsMobile();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { data: oppgaveVedlegg } = useGetVedleggForOppgave(fiksDigisosId, metadata.hendelsereferanse!, {
        query: { enabled: !!metadata.hendelsereferanse },
    });
    const { state: docState, resetState } = useDocumentState(id);
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
        resetState
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
                    <BodyShort lang="no">{description ?? t("beskrivelse")}</BodyShort>
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
            <FileSelectNew
                label={label}
                description={description}
                tag={tag}
                docState={docState}
                uploadId={id}
                onSelect={() => resetMutation()}
                variant={variant}
            />
            {mutationError && (
                <InlineMessage
                    status="error"
                    className="bg-ax-bg-danger-moderate border border-ax-border-error-subtle p-1 rounded-xl text-ax-text-danger [&>span]:w-full"
                >
                    <HStack justify="space-between" align="start">
                        <div>{t("error")}</div>
                        <Button
                            icon={<XMarkIcon aria-hidden />}
                            size="small"
                            onClick={resetMutation}
                            data-color="neutral"
                            variant="tertiary-neutral"
                        />
                    </HStack>
                </InlineMessage>
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
                <LocalAlert role="alert" status="success">
                    <LocalAlert.Header>
                        <LocalAlert.Title>{t("suksess")}</LocalAlert.Title>
                    </LocalAlert.Header>
                </LocalAlert>
            )}
        </VStack>
    );
};

export default OpplastingsboksTus;
