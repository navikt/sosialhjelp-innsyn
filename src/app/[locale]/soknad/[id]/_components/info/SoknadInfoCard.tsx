"use client";

import Info from "./Info";
import Behandlingstid from "./Behandlingstid";
import OppgaveListe from "./OppgaveListe";
import { BodyLong, BodyShort, VStack, Link as AkselLink, List } from "@navikt/ds-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Link } from "@i18n/navigation";
import VilkarReadMore from "../vilkar/readmore/VilkarReadMore";

type AlertState =
    | { type: "sendt"; navKontor?: string }
    | { type: "saksbehandlingstid"; navKontor?: string }
    | { type: "oppgaver"; oppgaver: { name: string; frist?: Date }[]; navKontor?: string }
    | { type: "soknadsOppgaver"; oppgaver: { name: string }[] }
    | { type: "nyttVedtak" }
    | { type: "forelopigSvar"; navKontor?: string; forelopigSvarUrl?: string }
    | { type: "vilkar"; vilkar: { name: string; frist?: Date }[] }
    | { type: "kanHaVilkar" }
    | { type: "ikkeInnsyn" }
    | { type: "behandlesIkke" };

interface Props {
    state: AlertState;
}

const SoknadInfoCard = ({ state }: Props) => {
    const t = useTranslations("SoknadInfoCard");
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;
    switch (state.type) {
        case "sendt":
            return (
                <Info variant="success" title={t("sendt.title")} titleId="sendt-info-card-title">
                    <Behandlingstid>
                        <Behandlingstid.Description navKontor={state.navKontor ?? t("defaultNavKontor")} />
                    </Behandlingstid>
                </Info>
            );
        case "forelopigSvar":
            return (
                <Info variant="warning" title={t("forelopigSvar.title")} titleId="forelopig-svar-info-card-title">
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
                <Info variant="info" title={t("mottatt.title")} titleId="mottattt-info-card-title">
                    <Behandlingstid>
                        <Behandlingstid.Description navKontor={state.navKontor ?? t("defaultNavKontor")} />
                    </Behandlingstid>
                </Info>
            );
        case "kanHaVilkar":
            return (
                <Info variant="warning" title={t("vilkar.titleEmpty")} titleId="vilkar-info-card-title">
                    <VStack gap="space-16">
                        <BodyLong>
                            {t.rich("vilkar.descriptionEmpty", {
                                link: (chunks) => (
                                    <AkselLink as={Link} href="#vedtak" inlineText>
                                        {chunks}
                                    </AkselLink>
                                ),
                            })}
                        </BodyLong>
                        <VilkarReadMore />
                    </VStack>
                </Info>
            );
        case "vilkar":
            return (
                <Info variant="warning" title={t("vilkar.title")} titleId="vilkar-info-card-title">
                    <VStack gap="space-16">
                        <BodyLong>{t("vilkar.description")}</BodyLong>
                        <List>
                            {state.vilkar.map(({ name, frist }, index) => (
                                <List.Item key={`${name}-${index}`}>
                                    {frist ? (
                                        t.rich("vilkar.vilkar", {
                                            bold: (chunks) => (
                                                <BodyShort as="span" weight="semibold">
                                                    {chunks}
                                                </BodyShort>
                                            ),
                                            name,
                                            frist: new Date(frist),
                                        })
                                    ) : (
                                        <BodyShort as="span" weight="semibold" lang="no">
                                            {name}
                                        </BodyShort>
                                    )}
                                </List.Item>
                            ))}
                        </List>
                        <BodyLong>{t("vilkar.kanHaFlere")}</BodyLong>
                    </VStack>
                </Info>
            );
        case "oppgaver":
            return (
                <Info variant="warning" title={t("oppgaver.title")} titleId="oppgaver-info-card-title">
                    <VStack gap="space-16">
                        <VStack gap="space-16">
                            <BodyLong>
                                {t.rich("oppgaver.description", {
                                    norsk: (chunks: ReactNode) => (
                                        <BodyShort as="span" lang="no">
                                            {chunks}
                                        </BodyShort>
                                    ),
                                    navKontor: state.navKontor ?? t("defaultNavKontor"),
                                })}
                            </BodyLong>
                            <OppgaveListe oppgaver={state.oppgaver} />
                        </VStack>
                        <BodyLong size="small">{t("oppgaver.warning")}</BodyLong>
                    </VStack>
                </Info>
            );
        case "soknadsOppgaver":
            return (
                <Info variant="reminder" title={t("soknadsOppgaver.title")} titleId="soknads-oppgaver-info-card-title">
                    <VStack gap="space-16">
                        <VStack gap="space-16">
                            <BodyLong>{t("soknadsOppgaver.description")}</BodyLong>
                            <OppgaveListe oppgaver={state.oppgaver} />
                        </VStack>
                        <BodyLong size="small">{t("soknadsOppgaver.disregardInfo")}</BodyLong>
                    </VStack>
                </Info>
            );
        case "nyttVedtak":
            return (
                <Info title={t("nyttVedtak.title")} variant="warning" titleId="nytt-vedtak-info-card-title">
                    {t("nyttVedtak.description")}
                </Info>
            );
        case "ikkeInnsyn":
            return (
                <Info title={t("ikkeInnsyn.title")} variant="warning" titleId={"ikke-innsyn-info-card-title"}>
                    {t.rich("ikkeInnsyn.description", {
                        navKontorLenke: (chunks) => (
                            <AkselLink inlineText href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>
                                {chunks}
                            </AkselLink>
                        ),
                        tlf: (chunks) => (
                            <AkselLink inlineText href="tel:55553333">
                                {chunks}
                            </AkselLink>
                        ),
                    })}
                </Info>
            );
        case "behandlesIkke":
            return (
                <Info title={t("behandlesIkke.title")} variant="warning" titleId={"behandles-ikke-info-card-title"}>
                    <BodyLong spacing>{t("behandlesIkke.description1")}</BodyLong>
                    <BodyLong>
                        {t.rich("behandlesIkke.description2", {
                            navKontorLenke: (chunks) => (
                                <AkselLink inlineText href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>
                                    {chunks}
                                </AkselLink>
                            ),
                            tlf: (chunks) => (
                                <AkselLink inlineText href="tel:55553333">
                                    {chunks}
                                </AkselLink>
                            ),
                        })}
                    </BodyLong>
                </Info>
            );
    }
};

export default SoknadInfoCard;
