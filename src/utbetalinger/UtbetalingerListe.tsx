"use client";

import React from "react";
import { BoxNew, Heading, VStack } from "@navikt/ds-react";

import { useUtbetalingerChip } from "./UtbetalingerProviderContext";
//import {
//    useHentNyeUtbetalinger,
//    useHentTidligereUtbetalinger,
//} from "@generated/utbetalinger-controller/utbetalinger-controller";

const UtbetalingerListe = () => {
    const { selectedChip } = useUtbetalingerChip();

    //const { data: nye } = useHentNyeUtbetalinger();
    //const { data: tidligere } = useHentTidligereUtbetalinger();

    return (
        <VStack gap="20">
            <Heading size="small" level="2">
                {selectedChip}
            </Heading>
            <VStack gap="1">
                <BoxNew background="info-moderate">måned</BoxNew>
                <BoxNew background="info-moderate"> hade</BoxNew>
            </VStack>
        </VStack>
    );
};

export default UtbetalingerListe;
