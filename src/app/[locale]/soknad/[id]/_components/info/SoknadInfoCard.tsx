"use client";

import Info from "./Info";
import { BodyLong, BodyShort, Link, List, ReadMore, VStack } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useTranslations } from "next-intl";
import React from "react";

type AlertState =
    | { type: "sendt"; navKontor?: string }
    | { type: "saksbehandlingstid"; navKontor?: string }
    | { type: "oppgaver"; oppgaver: { name: string; frist?: Date }[]; navKontor?: string }
    | { type: "nyttVedtak" };

interface Props {
    state: AlertState;
}

const Behandlingstid = ({ navKontor }: { navKontor: string }) => {
    const t = useTranslations("SoknadInfoCard.Behandlingstid");
    return (
        <VStack gap="space-8">
            <BodyLong>
                {t.rich("vilBehandle", {
                    norsk: (chunks) => (
                        <BodyShort as="span" lang="no">
                            {chunks}
                        </BodyShort>
                    ),
                    navKontor: navKontor,
                })}
            </BodyLong>
            <ReadMore header={t("saksbehandlingstid.tittel")}>
                <BodyLong spacing>{t("saksbehandlingstid.beskrivelse1")}</BodyLong>
                <BodyLong weight="semibold">{t("saksbehandlingstid.beskrivelse2")}</BodyLong>
                <BodyLong>{t("saksbehandlingstid.beskrivelse3")}</BodyLong>
            </ReadMore>
            <ReadMore header={t("melde.tittel")}>
                <BodyLong spacing>
                    {t.rich(`melde.beskrivelse`, {
                        lenke: (chunks) => (
                            <Link href="https://www.nav.no/okonomisk-sosialhjelp#melde" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
                <BodyLong>
                    {t.rich("melde.beskrivelse2", {
                        tel: (chunks) => (
                            <Link href="tel:55553333" inlineText>
                                {chunks}
                            </Link>
                        ),
                    })}
                </BodyLong>
            </ReadMore>
        </VStack>
    );
};

const SoknadInfoCard = ({ state }: Props) => {
    const t = useTranslations("SoknadInfoCard");
    switch (state.type) {
        case "sendt":
            return (
                <Info variant="success" title={t("sendt.title")}>
                    <Behandlingstid navKontor={state.navKontor ?? t("defaultNavKontor")} />
                </Info>
            );
        case "saksbehandlingstid":
            return (
                <Info variant="info" title={t("mottatt.title")}>
                    <Behandlingstid navKontor={state.navKontor ?? t("defaultNavKontor")} />
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
