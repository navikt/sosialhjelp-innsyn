"use client";

import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, Button, FormSummary, GuidePanel, HStack, List, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FormValues } from "../KlageForm";

interface Props {
    isLoading: boolean;
    isError: boolean;
    onTilbake: () => void;
    formValues: FormValues;
    otherInfo: OtherInfo;
}

interface OtherInfo {
    vedtakMottatt: string;
    soknadSendt?: string | null;
    navKontor?: string | null;
}

const StegOppsummering = ({ isLoading, isError, onTilbake, formValues, otherInfo }: Props) => {
    const t = useTranslations("KlageForm");

    return (
        <VStack gap="space-20">
            <GuidePanel poster>
                Se over at alt er riktig før du sender inn klagen. Hvis du vil endre begrunnelsen din eller legge til
                mer dokumentasjon, kan du gå tilbake til forrige side.
            </GuidePanel>
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">Oppsummering av klagen</FormSummary.Heading>
                </FormSummary.Header>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        <FormSummary.Label>Begrunnelse</FormSummary.Label>
                        <FormSummary.Value>{formValues.background}</FormSummary.Value>
                    </FormSummary.Answer>
                    <FormSummary.Answer>
                        <FormSummary.Label>Vedlegg</FormSummary.Label>
                        <FormSummary.Value>
                            <List as="ul">
                                {formValues.files.map((file) => (
                                    <List.Item key={file.file.name}>{file.file.name}</List.Item>
                                ))}
                            </List>
                        </FormSummary.Value>
                    </FormSummary.Answer>
                    <FormSummary.Answer>
                        <FormSummary.Label>Øvrige opplysninger</FormSummary.Label>
                        <FormSummary.Value>
                            <FormSummary.Answers>
                                {otherInfo.soknadSendt && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>Søknad sendt</FormSummary.Label>
                                        <FormSummary.Value>{otherInfo.soknadSendt}</FormSummary.Value>
                                    </FormSummary.Answer>
                                )}
                                <FormSummary.Answer>
                                    <FormSummary.Label>Vedtak mottatt</FormSummary.Label>
                                    <FormSummary.Value>{otherInfo.vedtakMottatt}</FormSummary.Value>
                                </FormSummary.Answer>
                                {otherInfo.navKontor && (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>Nav-kontor</FormSummary.Label>
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
                {isError && <Alert variant="error">{t("sendingFeilet")}</Alert>}
            </VStack>
        </VStack>
    );
};

export default StegOppsummering;
