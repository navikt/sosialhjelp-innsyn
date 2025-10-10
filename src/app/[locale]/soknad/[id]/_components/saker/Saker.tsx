"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";

import { SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";
import { useHentKlager } from "@generated/klage-controller/klage-controller";

import Sak, { SakSkeleton } from "./Sak";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    vilkarPromise: Promise<VilkarResponse[]>;
}

const Saker = ({ sakerPromise, vilkarPromise }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const saker = use(sakerPromise);
    const vilkar = use(vilkarPromise);

    const { data: klageData } = useHentKlager(fiksDigisosId);

    return (
        <>
            {saker.map((sak, index) => (
                <Sak
                    key={index}
                    sak={sak}
                    vilkar={vilkar.filter((it) => it.saksReferanse === sak.referanse)}
                    innsendtKlage={klageData?.find((klage) =>
                        sak.vedtaksfilUrlList?.some((vedtaksfil) => vedtaksfil.id === klage.vedtakId)
                    )}
                />
            ))}
        </>
    );
};

export const SakerSkeleton = () => <SakSkeleton />;

export default Saker;
