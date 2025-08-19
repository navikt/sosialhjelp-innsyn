"use client";

import { Chips, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";

import UtbetalingerListe from "../../../../utbetalinger/UtbetalingerListe";
import { ChipsChip, useUtbetalingerChip } from "../../../../utbetalinger/UtbetalingerProviderContext";

const chipOptions = [
    { key: "kommende", label: "Kommende" },
    { key: "siste3mnd", label: "Siste 3 måneder" },
    { key: "hitilIår", label: "Hitil i år" },
    { key: "ifjor", label: "I fjor" },
    { key: "egendefinert", label: "Egendefinert" },
] as const;

const Utbetalinger = () => {
    const { selectedChip, setSelectedChip } = useUtbetalingerChip();

    return (
        <VStack gap="6">
            <Chips>
                {chipOptions.map((option) => (
                    <ChipsToggle
                        key={option.key}
                        checkmark={false}
                        selected={selectedChip === option.key}
                        onClick={() => setSelectedChip(option.key as ChipsChip)}
                    >
                        {option.label}
                    </ChipsToggle>
                ))}
            </Chips>
            <UtbetalingerListe />
        </VStack>
    );
};

export default Utbetalinger;
