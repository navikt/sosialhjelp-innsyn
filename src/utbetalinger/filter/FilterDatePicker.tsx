import { useTranslations, useLocale } from "next-intl";
import React, { useState } from "react";
import { DatePicker, DateValidationT, useDatepicker } from "@navikt/ds-react";
import { subMonths } from "date-fns";

import useIsMobile from "../../utils/useIsMobile";

const validateFromDate = (
    { isAfter, isBefore, isInvalid, isValidDate }: DateValidationT,
    fromDate: Date | null | undefined
) => {
    if (!fromDate) {
        return;
    } else if (isBefore) {
        return fromDate ? "filter.tilEtterFra" : "filter.tidligstFra";
    } else if (isAfter) {
        return "filter.fraEtterTil";
    } else if (isInvalid || !isValidDate) {
        return "filter.ugylding";
    } else {
        return;
    }
};

export const FilterDatePicker = ({
    label,
    fromDate,
    toDate,
    defaultSelected,
    onDateChange,
}: {
    label: string;
    fromDate?: Date | null;
    toDate?: Date | null;
    defaultSelected?: Date | null;
    onDateChange: (date?: Date) => void;
}) => {
    const t = useTranslations("utbetalinger");

    const locale = useLocale();
    const isMobile = useIsMobile();
    const [dateError, setDateError] = useState<string | undefined>(undefined);
    const { datepickerProps, inputProps } = useDatepicker({
        fromDate: fromDate ?? subMonths(new Date(), 15),
        toDate: toDate ?? undefined,
        defaultSelected: defaultSelected ?? undefined,
        onDateChange,
        onValidate: (validation) => setDateError(validateFromDate(validation, fromDate)),
    });

    return (
        <DatePicker
            {...datepickerProps}
            strategy={isMobile ? "fixed" : undefined}
            locale={locale as "nb" | "nn" | "en"}
        >
            <DatePicker.Input
                {...inputProps}
                label={t(label)}
                description={t("filter.format")}
                error={datepickerProps.open ? undefined : dateError ? t(dateError) : undefined}
            />
        </DatePicker>
    );
};
