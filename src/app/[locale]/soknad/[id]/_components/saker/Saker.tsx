"use client";

import React, { use } from "react";
import { VStack } from "@navikt/ds-react";

import { SaksStatusResponse } from "@generated/model";

import Sak, { SakSkeleton } from "./Sak";
import DeltSoknadAlert from "./DeltSoknadAlert";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
}

const Saker = ({ sakerPromise }: Props) => {
    const saker = use(sakerPromise);
    return (
        <VStack gap="4">
            <DeltSoknadAlert saker={saker} />
            <VStack gap="10">
                {saker.map((sak, index) => (
                    <Sak key={index} sak={sak} />
                ))}
            </VStack>
        </VStack>
    );
};

export const SakerSkeleton = () => <SakSkeleton />;

export default Saker;
