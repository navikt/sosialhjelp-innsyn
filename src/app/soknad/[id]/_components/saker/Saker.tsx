"use client";

import React from "react";
import { VStack } from "@navikt/ds-react";

import SakBlokk from "./SakBlokk";
import SingleSak from "./SingleSak";
import { useHentSaksStatuserSuspense } from "@generated/saks-status-controller/saks-status-controller";
import { useHentKlager } from "@generated/klage-controller/klage-controller";
import { useParams } from "next/navigation";
import { sortSaker } from "./sort";

const Saker = () => {
    const { id } = useParams<{ id: string }>();
    const { data: saker } = useHentSaksStatuserSuspense(id);
    const { data: klager } = useHentKlager(id);
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

    return <SingleSak sak={saker[0]} klager={klager} />;
};

export default Saker;
