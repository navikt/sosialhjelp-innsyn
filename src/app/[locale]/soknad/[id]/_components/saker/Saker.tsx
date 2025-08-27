"use client";

import React, { use } from "react";

import { SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";

import Sak, { SakSkeleton } from "./Sak";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    vilkarPromise: Promise<VilkarResponse[]>;
}

const Saker = ({ sakerPromise, vilkarPromise }: Props) => {
    const saker = use(sakerPromise);
    const vilkar = use(vilkarPromise);
    return (
        <>
            {saker.map((sak, index) => (
                <Sak key={index} sak={sak} vilkar={vilkar.filter((it) => it.saksReferanse === sak.referanse)} />
            ))}
        </>
    );
};

export const SakerSkeleton = () => <SakSkeleton />;

export default Saker;
