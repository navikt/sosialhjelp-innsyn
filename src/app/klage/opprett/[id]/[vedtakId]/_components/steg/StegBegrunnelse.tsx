"use client";

import { ArrowRightIcon, FilePdfIcon } from "@navikt/aksel-icons";
import { Button, HStack, InlineMessage, Label, Provider, Textarea, VStack } from "@navikt/ds-react";
import { en, nb, nn } from "@navikt/ds-react/locales";
import { useLocale, useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormValues } from "../KlageForm";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { FilUrl } from "@generated/model";
import { parseISO } from "date-fns";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";
import { MAX_LEN_BACKGROUND } from "../../_consts/consts";

const akselLocales = { nb, nn, en };

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
    alleVedleggLastetOpp: boolean;
    vedleggHarFeil: boolean;
    vedtaksDato: string;
    vedtaksbrev?: FilUrl | undefined;
}

const StegBegrunnelse = ({
    contextId,
    vedtakId,
    klageId,
    harInnhold,
    alleVedleggLastetOpp,
    vedleggHarFeil,
    vedtaksbrev,
    docState,
    addUploads,
    removeUpload,
    onGaVidere,
    onForkastKlage,
    vedtaksDato,
}: Props) => {
    const t = useTranslations("KlageForm");
    const locale = useLocale();
    const {
        register,
        formState: { errors },
    } = useFormContext<FormValues>();
    const beskjed = vedleggHarFeil
        ? "vedleggHarFeil"
        : !alleVedleggLastetOpp
          ? "vedleggLaster"
          : !harInnhold
            ? "manglerInnhold"
            : undefined;

    return (
        <VStack gap="space-56">
            {vedtaksbrev && (
                <VStack gap="space-8">
                    <Label>{t("vedtaketDuKlagerPa")}</Label>
                    <DigisosLinkCard
                        dataColor="accent"
                        cardIcon="external-link"
                        href={vedtaksbrev.url}
                        icon={<FilePdfIcon title={t("pdf")} />}
                        description={t("mottatt", { dato: parseISO(vedtaksDato) })}
                    >
                        {t("vedtaksBrev")}
                    </DigisosLinkCard>
                </VStack>
            )}
            <Provider
                locale={akselLocales[locale as keyof typeof akselLocales] ?? nb}
                translations={{
                    Textarea: {
                        maxLength: t.raw("textarea.maxLength"),
                        charsLeft: t.raw("textarea.charsLeft"),
                        charsTooMany: t.raw("textarea.charsTooMany"),
                    },
                }}
            >
                <Textarea
                    id={"klageTextarea" + vedtakId}
                    resize
                    maxLength={MAX_LEN_BACKGROUND}
                    label={t("bakgrunn.label")}
                    description={t("bakgrunn.beskrivelse")}
                    error={
                        errors.background?.message && t(errors.background.message, { maksLengde: MAX_LEN_BACKGROUND })
                    }
                    {...register("background")}
                />
            </Provider>
            <FileSelectNew
                target={{ type: "klage", klageId: klageId }}
                docState={docState}
                contextId={contextId}
                onUploadsAdded={addUploads}
                onUploadRemoved={removeUpload}
                filesLabel={t("filOpplasting.vedlegg", { count: docState.uploads?.length ?? 0 })}
                label={t("filOpplasting.label")}
                description={t("filOpplasting.beskrivelse")}
                headingLevel="2"
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
                        disabled={!harInnhold || !alleVedleggLastetOpp || vedleggHarFeil}
                        aria-describedby={beskjed ? "klage-kan-ikke-ga-videre" : undefined}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                    >
                        {t("gaVidereKnapp")}
                    </Button>
                </HStack>
                {beskjed && (
                    <InlineMessage
                        id="klage-kan-ikke-ga-videre"
                        status={vedleggHarFeil ? "warning" : "info"}
                        role="status"
                    >
                        {t(beskjed)}
                    </InlineMessage>
                )}
            </VStack>
        </VStack>
    );
};

export default StegBegrunnelse;
