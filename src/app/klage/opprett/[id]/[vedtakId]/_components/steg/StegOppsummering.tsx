"use client";

import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Button, FormSummary, GuidePanel, HStack, List, LocalAlert, VStack } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
import { parseISO } from "date-fns";
import { UploadState } from "@components/filopplasting/api/useDocumentState";
import { FormValues } from "../KlageForm";

interface Props {
    isLoading: boolean;
    isError: boolean;
    ikkeTilgjengelig?: boolean;
    onTilbake: () => void;
    formValues: FormValues;
    uploads: UploadState[];
    otherInfo: OtherInfo;
}

interface OtherInfo {
    vedtakMottatt: string;
    soknadSendt?: string | null;
    navKontor?: string | null;
}

const StegOppsummering = ({
    isLoading,
    isError,
    ikkeTilgjengelig = false,
    onTilbake,
    formValues,
    uploads,
    otherInfo,
}: Props) => {
    const t = useTranslations("KlageForm");
    const format = useFormatter();
    const formatDate = (date: string) =>
        format.dateTime(parseISO(date), { day: "numeric", month: "long", year: "numeric" });

    return (
        <VStack gap="space-20">
            <GuidePanel poster>{t("oppsummering.guide")}</GuidePanel>
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">{t("oppsummering.tittel")}</FormSummary.Heading>
                </FormSummary.Header>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <FormSummary.Label>{t("oppsummering.begrunnelse")}</FormSummary.Label>
                        <FormSummary.Value>{formValues.background}</FormSummary.Value>
                    </FormSummary.Answer>
                    <FormSummary.Answer>
                        <FormSummary.Label>{t("oppsummering.vedlegg")}</FormSummary.Label>
                        <FormSummary.Value>
                            {uploads.length === 0 ? (
                                t("ingenVedlegg")
                            ) : (
                                <List as="ul">
                                    {uploads.map((upload) => (
                                        <List.Item key={upload.id}>
                                            {upload.finalFilename ?? upload.originalFilename}
                                        </List.Item>
                                    ))}
                                </List>
                            )}
                        </FormSummary.Value>
                    </FormSummary.Answer>
                    <FormSummary.Answer>
                        <FormSummary.Label>{t("oppsummering.ovrigeOpplysninger")}</FormSummary.Label>
                        <FormSummary.Value>
                            <FormSummary.Answers>
                                {otherInfo.soknadSendt && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>{t("oppsummering.soknadSendt")}</FormSummary.Label>
                                        <FormSummary.Value>{formatDate(otherInfo.soknadSendt)}</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}
                                <FormSummary.Answer>
                                    <FormSummary.Label>{t("oppsummering.vedtakMottatt")}</FormSummary.Label>
                                    <FormSummary.Value>{formatDate(otherInfo.vedtakMottatt)}</FormSummary.Value>
                                </FormSummary.Answer>
                                {otherInfo.navKontor && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>{t("oppsummering.navKontor")}</FormSummary.Label>
                                        <FormSummary.Value>{otherInfo.navKontor}</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}
                            </FormSummary.Answers>
                        </FormSummary.Value>
                    </FormSummary.Answer>
                </FormSummary.Answers>
            </FormSummary>
            <VStack gap="space-8">
                <HStack gap="space-4">
                    <Button
                        onClick={onTilbake}
                        type="button"
                        className="mb-4"
                        variant="secondary"
                        disabled={isLoading}
                        icon={<ArrowLeftIcon aria-hidden />}
                        iconPosition="left"
                    >
                        {t("tilbakeKnapp")}
                    </Button>
                    <Button
                        loading={isLoading}
                        type="submit"
                        className="mb-4"
                        icon={<PaperplaneIcon aria-hidden />}
                        iconPosition="right"
                    >
                        {t("sendKlage")}
                    </Button>
                </HStack>
                {ikkeTilgjengelig && (
                    <LocalAlert status="warning">
                        <LocalAlert.Header>
                            <LocalAlert.Title as="h2">{t("ikkeTilgjengelig")}</LocalAlert.Title>
                        </LocalAlert.Header>
                    </LocalAlert>
                )}
                {isError && (
                    <LocalAlert status="error">
                        <LocalAlert.Header>
                            <LocalAlert.Title as="h2">{t("sendingFeilet")}</LocalAlert.Title>
                        </LocalAlert.Header>
                    </LocalAlert>
                )}
            </VStack>
        </VStack>
    );
};

export default StegOppsummering;
