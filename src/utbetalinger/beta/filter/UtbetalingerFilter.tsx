import React, {useEffect, useState} from "react";
/* eslint-disable react/jsx-pascal-case */
import {Fieldset, Radio, RadioGroup, DatePicker, useDatepicker} from "@navikt/ds-react";
import styles from "./utbetalingerFilter.module.css";
import {MottakerFilter, useFilter} from "./FilterContext";
import {useTranslation} from "next-i18next";
import useIsMobile from "../../../utils/useIsMobile";
import {logAmplitudeEvent} from "../../../utils/amplitude";

function subtractMonths(date: Date, months: number) {
    date.setMonth(date.getMonth() - months);
    return date;
}

interface Props {
    setDatePickerIsOpen?: (value: boolean) => void;
}
const UtbetalingerFilter = (props: Props) => {
    const {filter, oppdaterFilter} = useFilter();
    const {t, i18n} = useTranslation("utbetalinger");

    const isMobile = useIsMobile();
    const {setDatePickerIsOpen} = props;
    const [fromDateError, setFromDateError] = useState<string | undefined>(undefined);
    const [toDateError, setToDateError] = useState<string | undefined>(undefined);

    const fromDatePicker = useDatepicker({
        fromDate: subtractMonths(new Date(), 15),
        toDate: filter.tilDato,
        defaultSelected: filter.fraDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, fraDato: dato});
            logAmplitudeEvent("filtervalg", {kategori: "fraDato", filternavn: dato});
        },
        onValidate: (val) => {
            if (val.isBefore) setFromDateError(t("filter.tidligstFra"));
            else if (val.isAfter) setFromDateError(t("filter.fraEtterTil"));
            else if (val.isInvalid) setFromDateError(t("filter.ugylding"));
            else if (val.isEmpty) setFromDateError(undefined);
            else if (!val.isValidDate) setFromDateError(t("filter.ugylding"));
            else setFromDateError(undefined);
        },
    });
    const toDatePicker = useDatepicker({
        fromDate: filter.fraDato ? filter.fraDato : subtractMonths(new Date(), 15),
        defaultSelected: filter.tilDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, tilDato: dato});
            logAmplitudeEvent("filtervalg", {kategori: "tilDato", filternavn: dato});
        },
        onValidate: (val) => {
            if (val.isBefore) setToDateError(filter.fraDato ? t("filter.tilEtterFra") : t("filter.tidligstFra"));
            else if (val.isInvalid) setToDateError(t("filter.ugylding"));
            else if (val.isEmpty) setToDateError(undefined);
            else if (!val.isValidDate) setToDateError(t("filter.ugylding"));
            else setToDateError(undefined);
        },
    });

    const isOpen = fromDatePicker.datepickerProps.open || toDatePicker.datepickerProps.open;
    useEffect(() => {
        if (setDatePickerIsOpen) {
            setDatePickerIsOpen(!!isOpen);
        }
    }, [isOpen, setDatePickerIsOpen]);

    const onMottakerChanged = (value: MottakerFilter) => {
        oppdaterFilter({...filter, mottaker: value});
        logAmplitudeEvent("filtervalg", {kategori: "mottaker", filternavn: value});
    };
    return (
        <div className={styles.utbetalinger_filter}>
            <Fieldset legend={t("filter.dato")} className={styles.periodevelger}>
                <DatePicker
                    {...fromDatePicker.datepickerProps}
                    strategy={isMobile ? "fixed" : undefined}
                    locale={i18n.language as "nb" | "nn" | "en"}
                >
                    <DatePicker.Input
                        {...fromDatePicker.inputProps}
                        label={t("filter.fra")}
                        description={t("filter.format")}
                        error={fromDatePicker.datepickerProps.open ? undefined : fromDateError}
                    />
                </DatePicker>

                <DatePicker
                    {...toDatePicker.datepickerProps}
                    strategy={isMobile ? "fixed" : undefined}
                    locale={i18n.language as "nb" | "nn" | "en"}
                >
                    <DatePicker.Input
                        {...toDatePicker.inputProps}
                        label={t("filter.til")}
                        description={t("filter.format")}
                        error={toDatePicker.datepickerProps.open ? undefined : toDateError}
                    />
                </DatePicker>
            </Fieldset>
            <RadioGroup defaultValue={filter.mottaker} legend={t("filter.mottaker")} onChange={onMottakerChanged}>
                <Radio value={MottakerFilter.Alle}>{t("filter.alle")}</Radio>
                <Radio value={MottakerFilter.MinKonto}>{t("filter.minKonto")}</Radio>
                <Radio value={MottakerFilter.AnnenMottaker}>{t("filter.annen")}</Radio>
            </RadioGroup>
        </div>
    );
};
export default UtbetalingerFilter;
