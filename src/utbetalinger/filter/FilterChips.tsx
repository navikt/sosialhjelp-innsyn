import { useTranslations } from "next-intl";
import { Box, Chips } from "@navikt/ds-react";
import React from "react";

import { dateToDDMMYYYY } from "../../utils/formatting";

import { useFilter } from "./lib/useFilter";

export const FilterChips = () => {
    const { filters, setFilter } = useFilter();
    const { t, i18n } = useTranslation("utbetalinger");

    if (!filters) return <Box padding="2" />;

    const { fraDato, tilDato, mottaker } = filters;

    return (
        <Chips className="my-2">
            {fraDato && (
                <Chips.Removable as="div" onClick={() => setFilter({ fraDato: null })}>
                    {t("filter.fra") + ": " + dateToDDMMYYYY(i18n.language, fraDato)}
                </Chips.Removable>
            )}
            {tilDato && (
                <Chips.Removable onClick={() => setFilter({ tilDato: null })}>
                    {t("filter.til") + ": " + dateToDDMMYYYY(i18n.language, tilDato)}
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
