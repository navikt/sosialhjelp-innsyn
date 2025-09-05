"use client";

import { Chips, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { useTranslations } from "next-intl";

import UtbetalingerListe from "./UtbetalingerListe";
import { ChipsChip, useUtbetalingerChip } from "./UtbetalingerProviderContext";

const chipOptions = [
    { key: "kommende", label: "perioder.kommende" },
    { key: "siste3", label: "perioder.siste3" },
    { key: "hittil", label: "perioder.hittil" },
    { key: "fjor", label: "perioder.fjor" },
    { key: "egendefinert", label: "perioder.egendefinert" },
] as const;

const Utbetalinger = () => {
    const { selectedChip, setSelectedChip } = useUtbetalingerChip();
    const t = useTranslations("utbetalinger");

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
                        {t("utbetalingerSide." + option.label)}
                    </ChipsToggle>
                ))}
            </Chips>
            <UtbetalingerListe />
        </VStack>
    );
};

export default Utbetalinger;
