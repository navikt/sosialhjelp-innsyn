"use client";

import { Alert, BodyShort, Box, Heading, HStack, Loader, Skeleton, Tag, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckmarkIcon } from "@navikt/aksel-icons";
import React from "react";

import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller/oppgave-controller";

const Oppgaver = () => {
    const t = useTranslations("Oppgaver");
    const { id } = useParams<{ id: string }>();

    const { data: oppgaver, isFetching } = useGetOppgaverBetaSuspense(id);

    return (
        <>
            <VStack gap="4">
                <HStack justify="space-between" align="center">
                    <Heading size="large" level="2">
                        {t("tittel")}
                    </Heading>
                    {isFetching && <Loader />}
                </HStack>
                {oppgaver?.every((oppgave) => oppgave.erLastetOpp) && (
                    <Alert variant="info">
                        <Heading size="small" level="3">
                            {t("ingenOppgaver.tittel")}
                        </Heading>
                        <BodyShort>{t("ingenOppgaver.beskrivelse")}</BodyShort>
                    </Alert>
                )}
                <NavigationGuardProvider>
                    {oppgaver?.map((oppgave) => {
                        const { typeTekst, tilleggsinfoTekst } = getVisningstekster(
                            oppgave.dokumenttype,
                            oppgave.tilleggsinformasjon
                        );
                        return (
                            <Box.New
                                key={oppgave.oppgaveId}
                                background="neutral-soft"
                                padding="space-24"
                                borderRadius="xlarge"
                            >
                                <Opplastingsboks
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
                                    metadata={{
                                        innsendelsesfrist: oppgave.innsendelsesfrist,
                                        hendelsereferanse: oppgave.hendelsereferanse,
                                        type: oppgave.dokumenttype,
                                        tilleggsinfo: oppgave.tilleggsinformasjon,
                                        hendelsetype: oppgave.hendelsetype,
                                    }}
                                />
                            </Box.New>
                        );
                    })}
                </NavigationGuardProvider>
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
