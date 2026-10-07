"use client";

import { ArrowRightIcon, ExternalLinkIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { Bleed, Button, HStack, InlineMessage, Label, Textarea, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormValues } from "../KlageForm";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { FilUrl } from "@generated/model";
import { LinkCard } from "@navikt/ds-react/LinkCard";
import { parseISO } from "date-fns";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";

interface Props {
    contextId: string;
    vedtakId: string;
    klageId: string;
    docState: DocumentState;
    addUploads: (uploads: UploadState[]) => void;
    removeUpload: (correlationId: string) => void;
    onGaVidere: () => void;
    onForkastKlage: () => void;
    harInnhold: boolean;
    vedtaksDato: string;
    vedtaksbrev?: FilUrl | undefined;
}

const StegBegrunnelse = ({
    contextId,
    vedtakId,
    klageId,
    harInnhold,
    vedtaksbrev,
    docState,
    addUploads,
    removeUpload,
    onGaVidere,
    onForkastKlage,
    vedtaksDato,
}: Props) => {
    const t = useTranslations("KlageForm");
    const {
        register,
        formState: { errors },
    } = useFormContext<FormValues>();

    return (
        <VStack gap="space-56">
            {vedtaksbrev && (
                <Bleed marginInline="full" reflectivePadding className="bg-ax-bg-neutral-soft py-5">
                    <VStack gap="space-8">
                        <Label>{t("vedtaketDuKlagerPa")}</Label>
                        <LinkCard data-color="accent" arrow={false}>
                            <LinkCard.Title>
                                <LinkCard.Anchor href={vedtaksbrev.url} target="_blank" rel="noopener noreferrer">
                                    <HStack justify="space-between">
                                        <span>{t("vedtaksBrev")}</span>
                                        <ExternalLinkIcon aria-hidden height="24px" width="24px" />
                                    </HStack>
                                </LinkCard.Anchor>
                            </LinkCard.Title>
                            <LinkCard.Description>{t("mottatt", { dato: parseISO(vedtaksDato) })}</LinkCard.Description>
                        </LinkCard>
                        <DigisosLinkCard
                            cardIcon="external-link"
                            href={vedtaksbrev.url}
                            icon={<FilePdfIcon title={t("pdf")} />}
                            description={t("mottatt", { dato: parseISO(vedtaksDato) })}
                        >
                            {t("vedtaksBrev")}
                        </DigisosLinkCard>
                    </VStack>
                </Bleed>
            )}
            <Textarea
                id={"klageTextarea" + vedtakId}
                resize
                label={t("bakgrunn.label")}
                description={t("bakgrunn.beskrivelse")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            />
            <FileSelectNew
                target={{ type: "klage", klageId: klageId }}
                docState={docState}
                contextId={contextId}
                onUploadsAdded={addUploads}
                onUploadRemoved={removeUpload}
                label={t("filOpplasting.label")}
                description={t("filOpplasting.beskrivelse")}
            />
            <VStack gap="space-24">
                <HStack gap="space-16">
                    <Button onClick={onForkastKlage} type="button" className="mb-4" variant="secondary">
                        {t("forkastKlageKnapp")}
                    </Button>
                    <Button
                        type="button"
                        onClick={onGaVidere}
                        className="mb-4"
                        disabled={!harInnhold}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                    >
                        {t("gaVidereKnapp")}
                    </Button>
                </HStack>
                {!harInnhold && (
                    <InlineMessage id="klage-mangler-innhold" status="info">
                        {t("manglerInnhold")}
                    </InlineMessage>
                )}
            </VStack>
        </VStack>
    );
};

export default StegBegrunnelse;
