"use client";

import React from "react";
import { VStack } from "@navikt/ds-react";

import {
    useHentNyeUtbetalinger,
    useHentTidligereUtbetalinger,
} from "@generated/utbetalinger-controller/utbetalinger-controller";

import { useUtbetalingerChip } from "./UtbetalingerProviderContext";
import { UtbetalingerKommende, UtbetalingerKommendeSkeleton } from "./UtbetalingerKommende";
import { UtbetalingerPerioder, UtbetalingerPerioderSkeleton } from "./UtbetalingerPerioder";
import { UtbetalingerEgendefinert } from "./UtbetalingerEgendefinert";

export const UtbetalingerListe = () => {
    const { selectedChip } = useUtbetalingerChip();
    const { data: nye, isLoading: nyeLoading } = useHentNyeUtbetalinger();
    const { data: tidligere, isLoading: tidligereLoading } = useHentTidligereUtbetalinger();

    return (
        <VStack gap="20">
            {selectedChip === "kommende" &&
                (nyeLoading ? (
                    <UtbetalingerKommendeSkeleton />
                ) : (
                    <UtbetalingerKommende nye={nye} selectedChip={selectedChip} />
                ))}
            {(selectedChip === "siste3" || selectedChip === "hitil" || selectedChip === "fjor") &&
                (tidligereLoading ? (
                    <UtbetalingerPerioderSkeleton />
                ) : (
                    <UtbetalingerPerioder tidligere={tidligere} selectedChip={selectedChip} />
                ))}
            {selectedChip === "egendefinert" && (
                <UtbetalingerEgendefinert nye={nye} tidligere={tidligere} selectedChip={selectedChip} />
            )}
        </VStack>
    );
};

export default UtbetalingerListe;
