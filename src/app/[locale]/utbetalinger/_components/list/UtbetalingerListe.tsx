"use client";

import React from "react";
import { VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { UtbetalingerCard } from "../utbetaling/UtbetalingerCard";
import { State } from "../utbetalingerReducer";

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
    const erKommende = selectedState.chip === "kommende";
    const sorterteData = erKommende ? data : data.toReversed();

    return (
        <VStack gap="space-64">
            <UtbetalingerListView tittel={tittel}>
                {data.length === 0 ? (
                    <IngenUtbetalinger selectedChip={selectedState.chip} />
                ) : (
                    sorterteData.map((gruppe) => (
                        <UtbetalingerCard
                            key={`${gruppe.ar}-${gruppe.maned}`}
                            manedMedUtbetalinger={gruppe}
                            erKommende={erKommende}
                        />
                    ))
                )}
            </UtbetalingerListView>
        </VStack>
    );
};

export default UtbetalingerListe;
