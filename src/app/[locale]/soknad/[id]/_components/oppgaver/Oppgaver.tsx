"use client";

import { Alert, Heading, HStack, Loader, Skeleton, Tag, VStack } from "@navikt/ds-react";
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

import TaskListItem from "../tasklistitem/TaskListItem";
import OppgaveTag from "../tasklistitem/OppgaveTag";
import OppgaverReadMore from "./readmore/OppgaverReadMore";
import ExpandableList from "@components/showmore/ExpandableList";
import { TasklistIcon } from "@navikt/aksel-icons";
import useIkkeInnsyn from "@hooks/useIkkeInnsyn";
import { useGetSaksDetaljerSuspense } from "@generated/saks-oversikt-controller/saks-oversikt-controller";

const withWarningColor = (text: string | undefined, isUncompleted: boolean) =>
    isUncompleted && text ? <span className="text-ax-text-warning">{text}</span> : text;

const Oppgaver = () => {
    const t = useTranslations("Oppgaver");
    const { id } = useParams<{ id: string }>();
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;
    // Kommer sortert på lastetOpp og deretter frist
    const { data: oppgaver, isFetching } = useGetOppgaverBetaSuspense(id);
    const { data: soknad } = useGetSaksDetaljerSuspense(id);
    const ikkeInnsyn = useIkkeInnsyn(soknad);

    const fullforteOppgaver = oppgaver.filter((oppgave) => oppgave.erLastetOpp);

    if (oppgaver.length === 0 || ikkeInnsyn) {
        return null;
    }

    const hasUncompletedOppgaver = oppgaver.length - fullforteOppgaver.length > 0;

    const isAllOppgaverFromSoknad = oppgaver.every((oppgave) => oppgave.erFraInnsyn === false);

    return (
        <VStack gap="space-8" as="section" aria-labelledby="oppgaver-tittel">
            <HStack align="center" gap="space-8">
                <Heading size="medium" level="2" id="oppgaver-tittel">
                    {isAllOppgaverFromSoknad ? t("missingInformationTitle") : t("tittel")}
                </Heading>
                {!isAllOppgaverFromSoknad && (
                    <Tag variant={hasUncompletedOppgaver ? "warning" : "success"} icon={<TasklistIcon aria-hidden />}>
                        {hasUncompletedOppgaver
                            ? t("xAvYFullfort", { fullfort: fullforteOppgaver.length, total: oppgaver.length })
                            : t("alleFullfort")}
                    </Tag>
                )}
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
                    gap={{ xs: "space-12", md: "space-16" }}
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
                            <TaskListItem
                                ref={ref}
                                key={`${oppgave.oppgaveId}-${oppgave.dokumenttype}-${oppgave.tilleggsinformasjon}`}
                                variant={oppgave.erLastetOpp || !oppgave.erFraInnsyn ? "normal" : "warning"}
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
                                        label={withWarningColor(typeTekst, !oppgave.erLastetOpp)}
                                        labelText={typeTekst}
                                        description={withWarningColor(tilleggsinfoTekst, !oppgave.erLastetOpp)}
                                        tag={
                                            <OppgaveTag
                                                frist={oppgave.innsendelsesfrist}
                                                completed={oppgave.erLastetOpp}
                                            />
                                        }
                                    />
                                )}
                            </TaskListItem>
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
