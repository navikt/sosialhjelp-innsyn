"use client";

import { Alert, Box, Button, Heading, HStack, Loader, Skeleton, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, FaceSmileIcon } from "@navikt/aksel-icons";
import React, { use } from "react";
import { LinkCard } from "@navikt/ds-react/LinkCard";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { useFlag } from "@featuretoggles/context";
import { Metadata } from "@components/filopplasting/new/types";
import { Icon } from "@components/statusCard/DigisosLinkCard";
import {
    useGetOppgaverBetaSuspense,
    useGetDokumentasjonkravBetaSuspense,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { VilkarResponse } from "@generated/ssr/model";

import VilkarListe from "../saker/vilkar/VilkarListe";
import Dokumentasjonkrav from "../saker/dokumentasjonkrav/Dokumentasjonkrav";

import OppgaveTag from "./OppgaveTag";

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
    const [showCompletedOppgaver, setShowCompletedOppgaver] = React.useState(false);

    const fullforteOppgaver = oppgaver.filter((oppgave) => oppgave.erLastetOpp);

    return (
        <>
            <VStack gap="4">
                <HStack justify="space-between" align="center">
                    <Heading size="medium" level="2">
                        {t("tittel")}
                    </Heading>
                    {isFetching && <Loader />}
                </HStack>
                {!showCompletedOppgaver && oppgaver.every((oppgave) => oppgave.erLastetOpp) && (
                    <LinkCard arrow={false} className="pointer-events-none">
                        <Icon icon={<FaceSmileIcon />} />
                        <LinkCard.Title as="h3">{t("ingenOppgaver.tittel")}</LinkCard.Title>
                        <LinkCard.Description>{t("ingenOppgaver.beskrivelse")}</LinkCard.Description>
                    </LinkCard>
                )}
                <NavigationGuardProvider>
                    {oppgaver
                        .filter((oppgave) => showCompletedOppgaver || !oppgave.erLastetOpp)
                        .map((oppgave) => {
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
                                <Box.New
                                    key={`${oppgave.oppgaveId}-${oppgave.dokumenttype}-${oppgave.tilleggsinformasjon}`}
                                    background={oppgave.erLastetOpp ? "neutral-soft" : "warning-soft"}
                                    padding="space-24"
                                    borderRadius="xlarge"
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
                                                    <Box.New lang="no">{tilleggsinfoTekst}</Box.New>
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
                                                    <Box.New lang="no">{tilleggsinfoTekst}</Box.New>
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
                                </Box.New>
                            );
                        })}
                </NavigationGuardProvider>
                {!showCompletedOppgaver && fullforteOppgaver.length > 0 && (
                    <Button
                        onClick={() => setShowCompletedOppgaver(true)}
                        variant="tertiary"
                        icon={<ChevronDownIcon />}
                        className="self-center"
                    >
                        {t("visFullforte")} ({fullforteOppgaver.length})
                    </Button>
                )}
                {vilkar.length > 0 && <VilkarListe vilkar={vilkar} />}
                {alleDokumentasjonkrav.length > 0 && <Dokumentasjonkrav dokumentasjonkrav={alleDokumentasjonkrav} />}
            </VStack>
        </>
    );
};

export const OppgaverSkeleton = () => {
    const t = useTranslations("Oppgaver");
    return (
        <VStack gap="4">
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
