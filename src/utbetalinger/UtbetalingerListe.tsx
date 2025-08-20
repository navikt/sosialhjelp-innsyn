"use client";

import React from "react";
import { Heading, VStack } from "@navikt/ds-react";

import {
    useHentNyeUtbetalinger,
    useHentTidligereUtbetalinger,
} from "@generated/utbetalinger-controller/utbetalinger-controller";

import { useUtbetalingerChip } from "./UtbetalingerProviderContext";
import UtbetalingerKommende from "./UtbetalingerKommende";
import UtbetalingerPerioder from "./UtbetalingerPerioder";
import UtbetalingerEgendefinert from "./UtbetalingerEgendefinert";

const UtbetalingerListe = () => {
    const { selectedChip } = useUtbetalingerChip();

    const { data: nye } = useHentNyeUtbetalinger();
    const { data: tidligere } = useHentTidligereUtbetalinger();

    return (
        <VStack gap="20">
            <VStack gap="1">
                <Heading size="small" level="2">
                    {selectedChip}
                </Heading>
                {selectedChip === "kommende" && <UtbetalingerKommende nye={nye} />}
                {(selectedChip === "siste3mnd" || selectedChip === "hitilIår" || selectedChip === "ifjor") && (
                    <UtbetalingerPerioder tidligere={tidligere} selectedChip={selectedChip} />
                )}
                {selectedChip === "egendefinert" && <UtbetalingerEgendefinert nye={nye} tidligere={tidligere} />}
            </VStack>
        </VStack>
    );
};

export default UtbetalingerListe;
