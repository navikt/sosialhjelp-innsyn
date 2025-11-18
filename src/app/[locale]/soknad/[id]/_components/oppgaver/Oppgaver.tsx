"use client";

import { Alert, Box, Button, Heading, HStack, Loader, Skeleton, Tag, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckmarkIcon, ChevronDownIcon, FaceSmileIcon } from "@navikt/aksel-icons";
import React from "react";
import { LinkCard } from "@navikt/ds-react/LinkCard";

import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { useFlag } from "@featuretoggles/context";
import { Metadata } from "@components/filopplasting/new/types";
import { Icon } from "@components/statusCard/DigisosLinkCard";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

const Oppgaver = () => {
    const t = useTranslations("Oppgaver");
    const { id } = useParams<{ id: string }>();
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;
    const { data: oppgaver, isFetching } = useGetOppgaverBetaSuspense(id);
    const [showCompletedOppgaver, setShowCompletedOppgaver] = React.useState(false);

    const fullforteOppgaver = oppgaver.filter((oppgave) => oppgave.erLastetOpp);

    return (
        <>
            <VStack gap="4">
                <HStack justify="space-between" align="center">
                    <Heading size="large" level="2">
                        {t("tittel")}
                    </Heading>
                    {isFetching && <Loader />}
                </HStack>
                {!showCompletedOppgaver && oppgaver.every((oppgave) => oppgave.erLastetOpp) && (
                    <LinkCard arrow={false} className="pointer-events-none">
                        <Icon icon={<FaceSmileIcon />} variant="info" />
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
                                    key={oppgave.oppgaveId}
                                    background="neutral-soft"
                                    padding="space-24"
                                    borderRadius="xlarge"
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
                                                oppgave.erLastetOpp ? (
                                                    <Tag variant="success" icon={<CheckmarkIcon />}>
                                                        {t("løst")}
                                                    </Tag>
                                                ) : (
                                                    oppgave.innsendelsesfrist && (
                                                        <Tag variant="warning">
                                                            {t("frist", { frist: new Date(oppgave.innsendelsesfrist) })}
                                                        </Tag>
                                                    )
                                                )
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
                                                oppgave.erLastetOpp ? (
                                                    <Tag variant="success" icon={<CheckmarkIcon />}>
                                                        {t("løst")}
                                                    </Tag>
                                                ) : (
                                                    oppgave.innsendelsesfrist && (
                                                        <Tag variant="warning">
                                                            {t("frist", { frist: new Date(oppgave.innsendelsesfrist) })}
                                                        </Tag>
                                                    )
                                                )
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
            </VStack>
        </>
    );
};

export const OppgaverSkeleton = () => {
    const t = useTranslations("Oppgaver");
    return (
        <VStack gap="4">
            <Heading size="large" level="2" spacing>
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
