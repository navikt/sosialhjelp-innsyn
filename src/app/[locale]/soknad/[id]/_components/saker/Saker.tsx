"use client";

import React, { use } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { SaksStatusResponse } from "@generated/model";

import SingleSak from "./sak/SingleSak";
import SakPanel from "./sak/sakpanel/SakPanel";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
}

const Saker = ({ sakerPromise }: Props) => {
    const t = useTranslations("Saker");
    const saker = use(sakerPromise);

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
            <VStack gap="space-64">
                {saker.map((sak) => (
                    <SakPanel key={sak.referanse} sak={sak} />
                ))}
            </VStack>
        </VStack>
    );
};

export default Saker;
