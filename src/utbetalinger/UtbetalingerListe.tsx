"use client";

import React from "react";

import { useUtbetalingerChip } from "./UtbetalingerProviderContext";

const UtbetalingerListe = () => {
    const { selectedChip } = useUtbetalingerChip();

    return <div>{selectedChip}</div>;
};

export default UtbetalingerListe;
