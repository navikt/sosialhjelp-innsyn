"use client";

import React, { use } from "react";

import { KlageRef, SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";

import Sak, { SakSkeleton } from "./Sak";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    vilkarPromise: Promise<VilkarResponse[]>;
    klagerPromise: Promise<KlageRef[]>;
}

const Saker = ({ sakerPromise, vilkarPromise, klagerPromise }: Props) => {
    const saker = use(sakerPromise);
    const vilkar = use(vilkarPromise);
    const klager = use(klagerPromise);

    return (
        <>
            {saker.map((sak, index) => (
                <Sak
                    key={index}
                    sak={sak}
                    vilkar={vilkar.filter((it) => it.saksReferanse === sak.referanse)}
                    innsendtKlage={klager.find((klage) =>
                        sak.vedtaksfilUrlList?.some((vedtaksfil) => vedtaksfil.id === klage.vedtakId)
                    )}
                />
            ))}
        </>
    );
};

export const SakerSkeleton = () => <SakSkeleton />;

export default Saker;
