"use client";

import { Alert, BodyShort, Box, Heading, HStack, Loader, Skeleton, Tag, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { use } from "react";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { useFlag } from "@featuretoggles/context";
import { Metadata } from "@components/filopplasting/new/types";
import {
    useGetOppgaverBetaSuspense,
    useGetDokumentasjonkravBetaSuspense,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { VilkarResponse } from "@generated/ssr/model";

import VilkarListe from "../saker/vilkar/VilkarListe";
import Dokumentasjonkrav from "../saker/dokumentasjonkrav/Dokumentasjonkrav";

import OppgaveTag from "./OppgaveTag";
import OppgaverReadMore from "./readmore/OppgaverReadMore";
import ExpandableList from "@components/showmore/ExpandableList";
import { TasklistIcon } from "@navikt/aksel-icons";

interface Props {
    vilkarPromise?: Promise<VilkarResponse[]>;
}

const Oppgaver = ({ vilkarPromise }: Props) => {
    const t = useTranslations("Oppgaver");
    const { id } = useParams<{ id: string }>();
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;
    const { data: oppgaver, isFetching } = useGetOppgaverBetaSuspense(id);
    const { data: alleDokumentasjonkrav } = useGetDokumentasjonkravBetaSuspense(id);
    const vilkar = vilkarPromise ? use(vilkarPromise) : [];

    if (oppgaver.length === 0) {
        return null;
    }

    const fullforteOppgaver = oppgaver.filter((oppgave) => oppgave.erLastetOpp);
    const hasUncompletedOppgaver = oppgaver.length - fullforteOppgaver.length > 0;
    const sortedOppgaver = oppgaver.toSorted((a, b) => {
        if (a.erLastetOpp === b.erLastetOpp) {
            return 0;
        }
        return a.erLastetOpp ? 1 : -1;
    });

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
                    items={sortedOppgaver}
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
                                background={
                                    oppgave.erLastetOpp || !oppgave.erFraInnsyn ? "neutral-soft" : "warning-soft"
                                }
                                padding="space-24"
                                borderRadius="12"
                                borderColor={oppgave.erLastetOpp ? "warning-subtle" : undefined}
                            >
                                {newUploadEnabled ? (
                                    <OpplastingsboksTus
                                        id={oppgave.oppgaveId}
                                        completed={oppgave.erLastetOpp}
                                        label={typeTekst}
                                        description={
                                            oppgave.erLastetOpp ? (
                                                t("lastetOpp", { dato: new Date(oppgave.opplastetDato!) })
                                            ) : (
                                                <BodyShort as="span" lang="no">
                                                    {tilleggsinfoTekst}
                                                </BodyShort>
                                            )
                                        }
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
                                        description={
                                            oppgave.erLastetOpp ? (
                                                t("lastetOpp", { dato: new Date(oppgave.opplastetDato!) })
                                            ) : (
                                                <BodyShort as="span" lang="no">
                                                    {tilleggsinfoTekst}
                                                </BodyShort>
                                            )
                                        }
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
            {vilkar.length > 0 && <VilkarListe vilkar={vilkar} />}
            {alleDokumentasjonkrav.length > 0 && <Dokumentasjonkrav dokumentasjonkrav={alleDokumentasjonkrav} />}
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
