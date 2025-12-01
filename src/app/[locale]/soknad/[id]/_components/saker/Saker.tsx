"use client";

import React, { use } from "react";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import SakListe from "./sak/SakListe";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    klagerPromise: Promise<KlageRef[]>;
}

const Saker = ({ sakerPromise, klagerPromise }: Props) => {
    const saker = use(sakerPromise);
    const klager = use(klagerPromise);

    if (!saker.length) {
        return null;
    }

    return <SakListe saker={saker} klager={klager} />;
};

export default Saker;
