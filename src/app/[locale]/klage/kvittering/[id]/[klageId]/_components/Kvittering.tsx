"use client";

import { BodyLong, Box, InfoCard, Link, ReadMore, VStack } from "@navikt/ds-react";
import { ArrowRedoIcon, CheckmarkCircleIcon, FilePdfIcon, HouseIcon, PaperclipIcon } from "@navikt/aksel-icons";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { useLocale, useTranslations } from "next-intl";
import { Process } from "@navikt/ds-react/Process";
import Snarveier from "@components/snarveier/Snarveier";
import { VedleggResponse } from "@generated/model";

interface Props {
    klagePdf: VedleggResponse;
    navKontor?: string | null;
}

const Kvittering = ({ klagePdf, navKontor }: Props) => {
    const t = useTranslations("StegKvittering");
    const locale = useLocale();
    const localeSuffix = locale === "nb" ? "" : `/${locale}`;

    return (
        <VStack gap="space-40">
            <InfoCard data-color="success">
                <InfoCard.Header icon={<CheckmarkCircleIcon aria-hidden />}>
                    <InfoCard.Title>{t("sendt.tittel")}</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                    {t.rich("sendt.beskrivelse", {
                        lenke: (chunks) => (
                            <Link inlineText href={`https://www.nav.no/sok-nav-kontor${localeSuffix}`}>
                                {chunks}
                            </Link>
                        ),
                        tel: (chunks) => (
                            <Link inlineText href="tel:+4755553333">
                                {chunks}
                            </Link>
                        ),
                    })}
                </InfoCard.Content>
            </InfoCard>
            <DigisosLinkCard
                cardIcon="external-link"
                openInNewTab
                href={klagePdf.url}
                icon={<FilePdfIcon title={t("pdf")} />}
                description={t("mottatt")}
            >
                {t("apneKlagen")}
            </DigisosLinkCard>
            <Box
                borderColor="info-subtle"
                background="info-soft"
                borderRadius="12"
                borderWidth="1"
                paddingBlock="space-8"
                paddingInline="space-16"
            >
                <Process>
                    <Process.Event bullet={1} title={t("prosess.steg1.tittel")}>
                        {navKontor
                            ? t("prosess.steg1.beskrivelse", { navKontor })
                            : t("prosess.steg1.beskrivelseUtenKontor")}
                    </Process.Event>
                    <Process.Event bullet={2} title={t("prosess.steg2.tittel")}>
                        {t("prosess.steg2.beskrivelse")}
                    </Process.Event>
                    <Process.Event bullet={3} title={t("prosess.steg3.tittel")}>
                        <span>{t("prosess.steg3.beskrivelse")}</span>
                        <ReadMore header={t("prosess.steg3.lesMer.tittel")}>
                            <BodyLong spacing>
                                {t.rich("prosess.steg3.lesMer.innhold.medhold", {
                                    b: (chunks) => <strong>{chunks}</strong>,
                                })}
                            </BodyLong>
                            <BodyLong>
                                {t.rich("prosess.steg3.lesMer.innhold.ikkeMedhold", {
                                    b: (chunks) => <strong>{chunks}</strong>,
                                })}
                            </BodyLong>
                        </ReadMore>
                    </Process.Event>
                </Process>
            </Box>
            <Snarveier hideSokButton>
                <li>
                    <DigisosLinkCard href="/sosialhjelp/soknad" icon={<ArrowRedoIcon aria-hidden />}>
                        {t("snarveier.tilSoknaden")}
                    </DigisosLinkCard>
                </li>
                <li>
                    <DigisosLinkCard href="/sosialhjelp/soknad" icon={<PaperclipIcon aria-hidden />}>
                        {t("snarveier.ettersendVedlegg")}
                    </DigisosLinkCard>
                </li>
                <li>
                    <DigisosLinkCard href="/sosialhjelp/innsyn" icon={<HouseIcon aria-hidden />}>
                        {t("snarveier.okonomiskSosialhjelp")}
                    </DigisosLinkCard>
                </li>
            </Snarveier>
        </VStack>
    );
};

export default Kvittering;
