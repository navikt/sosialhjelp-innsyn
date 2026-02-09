"use client";

import React, { use } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { KlageRef, SaksStatusResponse } from "@generated/model";

import SingleSak from "./sak/SingleSak";
import SakPanel from "./sak/sakpanel/SakPanel";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    klagerPromise: Promise<KlageRef[]>;
}

const findKlageForSak = (sak: SaksStatusResponse, klager: KlageRef[]): KlageRef | undefined =>
    klager.find((klage) => sak.vedtak?.some((vedtak) => vedtak.id === klage.vedtakId));

const Saker = ({ sakerPromise, klagerPromise }: Props) => {
    const t = useTranslations("Saker");
    const saker = use(sakerPromise);
    const klager = use(klagerPromise);

    if (!saker.length) {
        return null;
    }
    if (saker.length === 1) {
        const sak = saker[0];
        return <SingleSak sak={sak} innsendtKlage={findKlageForSak(sak, klager)} />;
    }

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("dineSaker")}
            </Heading>
            <VStack gap="16">
                {saker.map((sak) => (
                    <SakPanel key={sak.referanse} sak={sak} innsendtKlage={findKlageForSak(sak, klager)} />
                ))}
            </VStack>
        </VStack>
    );
};

export default Saker;
