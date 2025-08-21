"use client";

import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("utbetalinger");
    const { data: nye } = useHentNyeUtbetalinger();
    const { data: tidligere } = useHentTidligereUtbetalinger();

    return (
        <VStack gap="20">
            <VStack gap="1">
                <Heading size="small" level="2">
                    {t("utbetalingerSide.perioder." + selectedChip)}
                </Heading>
                {selectedChip === "kommende" && <UtbetalingerKommende nye={nye} />}
                {(selectedChip === "siste3" || selectedChip === "hitil" || selectedChip === "fjor") && (
                    <UtbetalingerPerioder tidligere={tidligere} />
                )}
                {selectedChip === "egendefinert" && <UtbetalingerEgendefinert nye={nye} tidligere={tidligere} />}
            </VStack>
        </VStack>
    );
};

export default UtbetalingerListe;
