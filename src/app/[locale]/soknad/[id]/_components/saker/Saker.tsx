"use client";

import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import ExpandableList from "@components/showmore/ExpandableList";
import VedtakPanel from "./VedtakPanel";
import SakBlokk from "./SakBlokk";
import { useHentSaksStatuserSuspense } from "@generated/saks-status-controller/saks-status-controller";
import { useHentKlager } from "@generated/klage-controller/klage-controller";
import { useParams } from "next/navigation";
import { useFlag } from "@featuretoggles/context";
import { sortSaker, sortVedtak } from "./sort";

const Saker = () => {
    const t = useTranslations("VedtakListe");
    const { id } = useParams<{ id: string }>();
    const { data: saker } = useHentSaksStatuserSuspense(id);
    const klageEnabled = useFlag("sosialhjelp.innsyn.klage").enabled;
    const { data: klager } = useHentKlager(id, { query: { enabled: klageEnabled } });
    if (!saker.length) {
        return null;
    }

    if (saker.length > 1) {
        const sorterteSaker = sortSaker(saker);

        return (
            <VStack gap="space-32">
                {sorterteSaker.map((sak, index) => (
                    <SakBlokk key={sak.referanse ?? index} sak={sak} klager={klager} index={index} />
                ))}
            </VStack>
        );
    }

    const sak = saker[0];
    const vedtak = sortVedtak(sak.vedtak).map((enkeltvedtak) => ({ vedtak: enkeltvedtak }));

    if (!vedtak.length) {
        return null;
    }

    return (
        <VStack gap="space-16">
            <Heading id="vedtak-heading" size="medium" level="2">
                {t("vedtak")}
            </Heading>
            <ExpandableList
                as="ol"
                items={vedtak}
                itemsLimit={1}
                id="vedtak-liste"
                labelledById="vedtak-heading"
                showMoreSuffix={t("showMoreSuffix")}
                gap="space-16"
            >
                {({ vedtak: enkeltvedtak }, ref) => (
                    <li key={enkeltvedtak.id} ref={ref} tabIndex={-1}>
                        <VedtakPanel
                            vedtak={enkeltvedtak}
                            innsendtKlage={klager?.find((klage) => klage.vedtakId === enkeltvedtak.id)}
                        />
                    </li>
                )}
            </ExpandableList>
        </VStack>
    );
};

export default Saker;
