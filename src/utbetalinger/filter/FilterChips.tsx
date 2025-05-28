import { useTranslations } from "next-intl";
import { Box, Chips } from "@navikt/ds-react";
import React from "react";

import { useFilter } from "./lib/useFilter";

export const FilterChips = () => {
    const { filters, setFilter } = useFilter();
    const t = useTranslations("utbetalinger");

    if (!filters) return <Box padding="2" />;

    const { fraDato, tilDato, mottaker } = filters;

    return (
        <Chips className="my-2">
            {fraDato && (
                <Chips.Removable as="div" onClick={() => setFilter({ fraDato: null })}>
                    {t("filter.fraDato", { fra: fraDato })}
                </Chips.Removable>
            )}
            {tilDato && (
                <Chips.Removable onClick={() => setFilter({ tilDato: null })}>
                    {t("filter.tilDato", { til: tilDato })}
                </Chips.Removable>
            )}
            {mottaker && (
                <Chips.Removable onClick={() => setFilter({ mottaker: null })}>
                    {t(`filter.mottaker.${mottaker}` as const)}
                </Chips.Removable>
            )}
        </Chips>
    );
};
