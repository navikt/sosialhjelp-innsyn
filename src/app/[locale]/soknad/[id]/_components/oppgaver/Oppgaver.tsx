"use client";

import { Alert, Box, Heading, HStack, Loader, Skeleton, Tag, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { useFlag } from "@featuretoggles/context";
import { Metadata } from "@components/filopplasting/new/types";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

import OppgaveTag from "./OppgaveTag";
import OppgaverReadMore from "./readmore/OppgaverReadMore";
import ExpandableList from "@components/showmore/ExpandableList";
import { TasklistIcon } from "@navikt/aksel-icons";

const Oppgaver = () => {
    const t = useTranslations("Oppgaver");
    const { id } = useParams<{ id: string }>();
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;
    // Kommer sortert på lastetOpp og deretter frist
    const { data: oppgaver, isFetching } = useGetOppgaverBetaSuspense(id);

    if (oppgaver.length === 0) {
        return null;
    }

    const fullforteOppgaver = oppgaver.filter((oppgave) => oppgave.erLastetOpp);
    const hasUncompletedOppgaver = oppgaver.length - fullforteOppgaver.length > 0;

    return (
        <VStack gap="space-8" as="section" aria-labelledby="oppgaver-tittel">
            <HStack align="center" gap="space-8">
                <Heading size="medium" level="2" id="oppgaver-tittel">
                    {t("tittel")}
                </Heading>
                <Tag variant={hasUncompletedOppgaver ? "warning" : "success"} icon={<TasklistIcon aria-hidden />}>
                    {hasUncompletedOppgaver
                        ? t("xAvYFullfort", { fullfort: fullforteOppgaver.length, total: oppgaver.length })
                        : t("alleFullfort")}
                </Tag>
                {isFetching && <Loader />}
            </HStack>
            {hasUncompletedOppgaver && <OppgaverReadMore />}
            <NavigationGuardProvider>
                <ExpandableList
                    items={oppgaver}
                    id={"oppgaver"}
                    showMoreSuffix={t("suffix")}
                    labelledById="oppgaver-tittel"
                    itemsLimit={hasUncompletedOppgaver ? 3 : 1}
                >
                    {(oppgave, ref) => {
                        const { typeTekst, tilleggsinfoTekst } = getVisningstekster(
                            oppgave.dokumenttype,
                            oppgave.tilleggsinformasjon
                        );
                        const metadata: Metadata = {
                            dokumentKontekst: "dokumentasjonetterspurt",
                            innsendelsesfrist: oppgave.innsendelsesfrist,
                            hendelsereferanse: oppgave.hendelsereferanse,
                            type: oppgave.dokumenttype,
                            tilleggsinfo: oppgave.tilleggsinformasjon,
                            hendelsetype: oppgave.hendelsetype,
                        };
                        return (
                            <Box
                                as="li"
                                ref={ref}
                                key={`${oppgave.oppgaveId}-${oppgave.dokumenttype}-${oppgave.tilleggsinformasjon}`}
                                background={oppgave.erLastetOpp ? "neutral-soft" : "warning-soft"}
                                padding={{ xs: "space-16", sm: "space-24" }}
                                borderRadius="12"
                                borderWidth="1"
                                borderColor={oppgave.erLastetOpp ? "neutral-subtle" : "warning-subtle"}
                            >
                                {newUploadEnabled ? (
                                    <OpplastingsboksTus
                                        id={oppgave.oppgaveId}
                                        completed={oppgave.erLastetOpp}
                                        label={typeTekst}
                                        description={tilleggsinfoTekst}
                                        tag={
                                            <OppgaveTag
                                                frist={oppgave.innsendelsesfrist}
                                                completed={oppgave.erLastetOpp}
                                            />
                                        }
                                        metadata={metadata}
                                    />
                                ) : (
                                    <Opplastingsboks
                                        metadata={metadata}
                                        completed={oppgave.erLastetOpp}
                                        label={typeTekst}
                                        description={tilleggsinfoTekst}
                                        tag={
                                            <OppgaveTag
                                                frist={oppgave.innsendelsesfrist}
                                                completed={oppgave.erLastetOpp}
                                            />
                                        }
                                    />
                                )}
                            </Box>
                        );
                    }}
                </ExpandableList>
            </NavigationGuardProvider>
        </VStack>
    );
};

export const OppgaverSkeleton = () => {
    const t = useTranslations("Oppgaver");
    return (
        <VStack gap="space-16">
            <Heading size="medium" level="2" spacing>
                {t("tittel")}
            </Heading>
            <Alert variant="info">
                <Heading level="3" size="medium">
                    <Skeleton width="100px" />
                </Heading>
                <Skeleton width="400px" height="20px" />
            </Alert>
        </VStack>
    );
};

export default Oppgaver;
