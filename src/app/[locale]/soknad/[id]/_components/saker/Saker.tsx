"use client";

import React from "react";
import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import SingleSak from "./sak/SingleSak";
import SakPanel from "./sak/sakpanel/SakPanel";
import { useHentSaksStatuserSuspense } from "@generated/saks-status-controller/saks-status-controller";
import { useParams } from "next/navigation";

const Saker = () => {
    const t = useTranslations("Saker");
    const { id } = useParams<{ id: string }>();
    const { data: saker } = useHentSaksStatuserSuspense(id);

    if (!saker.length) {
        return null;
    }
    if (saker.length === 1) {
        const sak = saker[0];
        return <SingleSak sak={sak} />;
    }

    return (
        <VStack gap="space-8">
            <Heading size="medium" level="2">
                {t("dineSaker")}
            </Heading>
            <BodyLong>{t("deltSoknadInfo", { n: saker.length })}</BodyLong>
            <VStack gap="space-16">
                {saker.map((sak) => (
                    <SakPanel key={sak.referanse} sak={sak} />
                ))}
            </VStack>
        </VStack>
    );
};

export default Saker;
