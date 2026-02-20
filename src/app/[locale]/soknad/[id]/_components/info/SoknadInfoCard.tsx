"use client";

import Info from "./Info";
import Behandlingstid from "./Behandlingstid";
import { BodyLong, BodyShort, List, VStack } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useTranslations } from "next-intl";
import React from "react";

type AlertState =
    | { type: "sendt"; navKontor?: string }
    | { type: "saksbehandlingstid"; navKontor?: string }
    | { type: "oppgaver"; oppgaver: { name: string; frist?: Date }[]; navKontor?: string }
    | { type: "nyttVedtak" }
    | { type: "forelopigSvar"; navKontor?: string; forelopigSvarUrl?: string };

interface Props {
    state: AlertState;
}

const SoknadInfoCard = ({ state }: Props) => {
    const t = useTranslations("SoknadInfoCard");
    switch (state.type) {
        case "sendt":
            return (
                <Info variant="success" title={t("sendt.title")}>
                    <Behandlingstid>
                        <Behandlingstid.Description navKontor={state.navKontor ?? t("defaultNavKontor")} />
                    </Behandlingstid>
                </Info>
            );
        case "forelopigSvar":
            return (
                <Info variant="warning" title={t("forelopigSvar.title")}>
                    <Behandlingstid>
                        <Behandlingstid.ForlengetDescription
                            navKontor={state.navKontor ?? t("defaultNavKontor")}
                            forelopigSvarUrl={state.forelopigSvarUrl}
                        />
                    </Behandlingstid>
                </Info>
            );
        case "saksbehandlingstid":
            return (
                <Info variant="info" title={t("mottatt.title")}>
                    <Behandlingstid>
                        <Behandlingstid.Description navKontor={state.navKontor ?? t("defaultNavKontor")} />
                    </Behandlingstid>
                </Info>
            );
        case "oppgaver":
            return (
                <Info variant="warning" title={t("oppgaver.title")}>
                    <VStack gap="space-16">
                        <VStack gap="space-4">
                            <BodyLong>
                                {t.rich("oppgaver.description", {
                                    norsk: (chunks) => (
                                        <BodyShort as="span" lang="no">
                                            {chunks}
                                        </BodyShort>
                                    ),
                                    navKontor: state.navKontor ?? t("defaultNavKontor"),
                                })}
                            </BodyLong>
                            <List>
                                {state.oppgaver.map(({ name, frist }, index) => (
                                    <ListItem key={`${name}-${index}`}>
                                        {frist ? (
                                            t.rich("oppgaver.oppgave", {
                                                bold: (chunks) => (
                                                    <BodyShort as="span" weight="semibold">
                                                        {chunks}
                                                    </BodyShort>
                                                ),
                                                name,
                                                frist: new Date(frist),
                                            })
                                        ) : (
                                            <BodyShort weight="semibold">{name}</BodyShort>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </VStack>
                        <BodyLong size="small">{t("oppgaver.warning")}</BodyLong>
                    </VStack>
                </Info>
            );
        case "nyttVedtak":
            return (
                <Info title={t("nyttVedtak.title")} variant="warning">
                    {t("nyttVedtak.description")}
                </Info>
            );
    }
};

export default SoknadInfoCard;
