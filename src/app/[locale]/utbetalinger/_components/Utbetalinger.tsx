"use client";

import { Chips, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { useTranslations } from "next-intl";

import UtbetalingerListe from "./UtbetalingerListe";
import { ChipsChip, useUtbetalingerChip } from "./UtbetalingerProviderContext";

const chipOptions = [
    { key: "kommende", label: "kommende" },
    { key: "siste3", label: "siste3" },
    { key: "hittil", label: "hittil" },
    { key: "fjor", label: "fjor" },
    { key: "egendefinert", label: "egendefinert" },
] as const;

const Utbetalinger = () => {
    const { selectedChip, setSelectedChip } = useUtbetalingerChip();
    const t = useTranslations("UtbetalingerChips");

    return (
        <VStack gap="16">
            <Chips>
                {chipOptions.map((option) => (
                    <ChipsToggle
                        key={option.key}
                        checkmark={false}
                        selected={selectedChip === option.key}
                        onClick={() => setSelectedChip(option.key as ChipsChip)}
                    >
                        {t(option.label)}
                    </ChipsToggle>
                ))}
            </Chips>
            <UtbetalingerListe />
        </VStack>
    );
};

export default Utbetalinger;
