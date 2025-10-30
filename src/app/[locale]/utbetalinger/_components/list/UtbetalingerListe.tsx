"use client";

import React from "react";
import { VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import type { State } from "../utbetalingerReducer";
import { UtbetalingerCard } from "../utbetaling/UtbetalingerCard";

import UtbetalingerListView from "./UtbetalingerListView";
import IngenUtbetalinger from "./IngenUtbetalinger";
import { useUtbetalinger } from "./useUtbetalingerListe";

interface Props {
    selectedState: State;
}

const UtbetalingerListe = ({ selectedState }: Props) => {
    const t = useTranslations("UtbetalingerListe");

    const { data } = useUtbetalinger({
        selectedState,
    });

    const tittel = t(`tittel.${selectedState?.chip}`);
    return (
        <VStack gap="16">
            <UtbetalingerListView tittel={tittel}>
                {data.length === 0 ? (
                    <IngenUtbetalinger selectedChip={selectedState.chip} />
                ) : (
                    data
                        .toReversed()
                        .map((gruppe) => (
                            <UtbetalingerCard key={`${gruppe.ar}-${gruppe.maned}`} utbetalinger={gruppe} />
                        ))
                )}
            </UtbetalingerListView>
        </VStack>
    );
};

export default UtbetalingerListe;
