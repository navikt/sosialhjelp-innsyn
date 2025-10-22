"use client";

import React, { use } from "react";

import { KlageRef, SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";

import Sak from "./sak/Sak";
import SingleSak from "./sak/SingleSak";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    vilkarPromise: Promise<VilkarResponse[]>;
    klagerPromise: Promise<KlageRef[]>;
}

const Saker = ({ sakerPromise, vilkarPromise, klagerPromise }: Props) => {
    const saker = use(sakerPromise);
    const vilkar = use(vilkarPromise);
    const klager = use(klagerPromise);

    if (!saker.length) {
        return null;
    }
    if (saker.length === 1) {
        const sak = saker[0];
        return (
            <SingleSak
                sak={sak}
                vilkar={vilkar.filter((it) => it.saksReferanse === sak.referanse)}
                innsendtKlage={klager.find((klage) =>
                    sak.vedtaksfilUrlList?.some((vedtaksfil) => vedtaksfil.id === klage.vedtakId)
                )}
            />
        );
    }

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

export default Saker;
