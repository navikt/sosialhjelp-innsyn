"use client";

import React, { use } from "react";
import { VStack } from "@navikt/ds-react";

import { SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";

import Sak, { SakSkeleton } from "./Sak";
import DeltSoknadAlert from "./DeltSoknadAlert";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    vilkarPromise: Promise<VilkarResponse[]>;
}

const Saker = ({ sakerPromise, vilkarPromise }: Props) => {
    const saker = use(sakerPromise);
    const vilkar = use(vilkarPromise);
    return (
        <VStack gap="4">
            <DeltSoknadAlert saker={saker} />
            <VStack gap="10">
                {saker.map((sak, index) => (
                    <Sak key={index} sak={sak} vilkar={vilkar.filter((it) => it.saksReferanse === sak.referanse)} />
                ))}
            </VStack>
        </VStack>
    );
};

export const SakerSkeleton = () => <SakSkeleton />;

export default Saker;
