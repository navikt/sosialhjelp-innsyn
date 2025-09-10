"use client";

import { Chips, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { useTranslations } from "next-intl";
import { useState } from "react";

import UtbetalingerListe from "./UtbetalingerListe";

export type ChipsChip = "kommende" | "siste3" | "hittil" | "fjor" | "egendefinert";

const ChipRekke = ["kommende", "siste3", "hittil", "fjor", "egendefinert"] as const satisfies readonly ChipsChip[];

const Utbetalinger = () => {
    const t = useTranslations("UtbetalingerChips");
    const [selectedChip, setSelectedChip] = useState<ChipsChip>("kommende");

    return (
        <VStack gap="16">
            <Chips>
                {ChipRekke.map((chip) => (
                    <ChipsToggle
                        key={chip}
                        checkmark={false}
                        selected={selectedChip === chip}
                        onClick={() => setSelectedChip(chip)}
                    >
                        {t(chip)}
                    </ChipsToggle>
                ))}
            </Chips>
            <UtbetalingerListe valgteChip={selectedChip} />
        </VStack>
    );
};

export default Utbetalinger;
