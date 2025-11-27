"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";
import { VStack } from "@navikt/ds-react";

import { KlageRef, SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";
import { useGetDokumentasjonkravBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

import SakListe from "./sak/SakListe";
import VilkarListe from "./vilkar/VilkarListe";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    vilkarPromise: Promise<VilkarResponse[]>;
    klagerPromise: Promise<KlageRef[]>;
}

const Saker = ({ sakerPromise, vilkarPromise, klagerPromise }: Props) => {
    const saker = use(sakerPromise);
    const vilkar = use(vilkarPromise);
    const klager = use(klagerPromise);
    const { id } = useParams<{ id: string }>();
    const { data } = useGetDokumentasjonkravBetaSuspense(id);

    if (!saker.length) {
        return null;
    }

    const alleDokumentasjonkrav = saker.flatMap((sak) => data.filter((it) => it.saksreferanse === sak.referanse));

    return (
        <VStack gap="16">
            <SakListe saker={saker} klager={klager} />
            {vilkar.length > 0 && <VilkarListe vilkar={vilkar} dokumentasjonkrav={alleDokumentasjonkrav} />}
        </VStack>
    );
};

export default Saker;
