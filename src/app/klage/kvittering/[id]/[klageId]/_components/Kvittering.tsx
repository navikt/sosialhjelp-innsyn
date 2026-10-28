"use client";

import { Box, InfoCard, Link, VStack } from "@navikt/ds-react";
import { ArrowRedoIcon, CheckmarkCircleIcon, FilePdfIcon, HouseIcon, PaperclipIcon } from "@navikt/aksel-icons";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { useLocale, useTranslations } from "next-intl";
import Snarveier from "@components/snarveier/Snarveier";
import { VedleggResponse } from "@generated/model";
import ProsessenVidere from "@components/klage/ProsessenVidere";

interface Props {
    klagePdf: VedleggResponse;
    navKontor?: string | null;
    fiksDigisosId: string;
    klageId: string;
}

const Kvittering = ({ klagePdf, navKontor, fiksDigisosId, klageId }: Props) => {
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
                description={t("mottatt", { dato: new Date(klagePdf.datoLagtTil) })}
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
                <ProsessenVidere navKontor={navKontor} />
            </Box>
            <Snarveier hideSokButton>
                <li>
                    <DigisosLinkCard href={`/soknad/${fiksDigisosId}`} icon={<ArrowRedoIcon aria-hidden />}>
                        {t("snarveier.tilSoknaden")}
                    </DigisosLinkCard>
                </li>
                <li>
                    <DigisosLinkCard
                        href={`/klage/status/${fiksDigisosId}/${klageId}`}
                        icon={<PaperclipIcon aria-hidden />}
                    >
                        {t("snarveier.ettersendVedlegg")}
                    </DigisosLinkCard>
                </li>
                <li>
                    <DigisosLinkCard href="/" icon={<HouseIcon aria-hidden />}>
                        {t("snarveier.okonomiskSosialhjelp")}
                    </DigisosLinkCard>
                </li>
            </Snarveier>
        </VStack>
    );
};

export default Kvittering;
