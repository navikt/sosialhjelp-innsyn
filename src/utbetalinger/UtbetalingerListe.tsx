"use client";

import React from "react";
import { VStack } from "@navikt/ds-react";

import {
    useHentNyeUtbetalinger,
    useHentTidligereUtbetalinger,
} from "@generated/utbetalinger-controller/utbetalinger-controller";

import { useUtbetalingerChip } from "./UtbetalingerProviderContext";
import UtbetalingerKommende from "./UtbetalingerKommende";
import UtbetalingerPerioder from "./UtbetalingerPerioder";
import { UtbetalingerEgendefinert } from "./UtbetalingerEgendefinert";

const UtbetalingerListe = () => {
    const { selectedChip } = useUtbetalingerChip();
    const { data: nye } = useHentNyeUtbetalinger();
    const { data: tidligere } = useHentTidligereUtbetalinger();

    return (
        <VStack gap="20">
            {selectedChip === "kommende" && <UtbetalingerKommende nye={nye} selectedChip={selectedChip} />}
            {(selectedChip === "siste3" || selectedChip === "hitil" || selectedChip === "fjor") && (
                <UtbetalingerPerioder tidligere={tidligere} selectedChip={selectedChip} />
            )}
            {selectedChip === "egendefinert" && (
                <UtbetalingerEgendefinert nye={nye} tidligere={tidligere} selectedChip={selectedChip} />
            )}
        </VStack>
    );
};

export default UtbetalingerListe;
