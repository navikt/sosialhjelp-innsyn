import React, {useEffect, useState} from "react";
/* eslint-disable react/jsx-pascal-case */
import {Fieldset, Panel, Radio, RadioGroup, UNSAFE_DatePicker, UNSAFE_useDatepicker} from "@navikt/ds-react";
import styles from "./utbetalingerFilter.module.css";
import {MottakerFilter, useFilter} from "./FilterContext";
import {useTranslation} from "react-i18next";
import useIsMobile from "../../../utils/useIsMobile";

function subtractMonths(date: Date, months: number) {
    date.setMonth(date.getMonth() - months);
    return date;
}

interface Props {
    setDatePickerIsOpen?: (value: boolean) => void;
}
const UtbetalingerFilter = (props: Props) => {
    const {filter, oppdaterFilter} = useFilter();
    const {i18n} = useTranslation();
    const isMobile = useIsMobile();
    const {setDatePickerIsOpen} = props;
    const [fromDateError, setFromDateError] = useState<string | undefined>(undefined);
    const [toDateError, setToDateError] = useState<string | undefined>(undefined);

    const fromDatePicker = UNSAFE_useDatepicker({
        fromDate: subtractMonths(new Date(), 15),
        toDate: filter.tilDato,
        defaultSelected: filter.fraDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, fraDato: dato});
        },
        onValidate: (val) => {
            if (val.isBefore) setFromDateError("Tidligste søkedato er 15 måneder tilbake");
            else if (val.isAfter) setFromDateError("Fra-dato kan ikke være etter til-dato");
            else if (val.isInvalid) setFromDateError("Datoen på være på format dd.mm.yyyy");
            else if (val.isEmpty) setFromDateError(undefined);
            else if (!val.isValidDate) setFromDateError("Datoen på være på format dd.mm.yyyy");
            else setFromDateError(undefined);
        },
    });
    const toDatePicker = UNSAFE_useDatepicker({
        fromDate: filter.fraDato ? filter.fraDato : subtractMonths(new Date(), 15),
        defaultSelected: filter.tilDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, tilDato: dato});
        },
        onValidate: (val) => {
            if (val.isBefore)
                setToDateError(
                    filter.fraDato ? "Til-dato kan ikke være før fra-dato" : "Tidligste søkedato er 15 måneder tilbake"
                );
            else if (val.isInvalid) setToDateError("Datoen på være på format dd.mm.yyyy");
            else if (val.isEmpty) setToDateError(undefined);
            else if (!val.isValidDate) setToDateError("Datoen på være på format dd.mm.yyyy");
            else setToDateError(undefined);
        },
    });

    const isOpen = fromDatePicker.datepickerProps.open || toDatePicker.datepickerProps.open;
    useEffect(() => {
        if (setDatePickerIsOpen) {
            setDatePickerIsOpen(!!isOpen);
        }
    }, [isOpen, setDatePickerIsOpen]);

    const onMottakerChanged = (values: MottakerFilter) => {
        oppdaterFilter({...filter, mottaker: values});
    };
    return (
        <Panel as="section" aria-label="Filtrer utbetalinger" className={styles.utbetalinger_filter}>
            <>
                <Fieldset legend="Filtrer på utbetalingsdato" className={styles.periodevelger}>
                    <UNSAFE_DatePicker
                        {...fromDatePicker.datepickerProps}
                        strategy={isMobile ? "fixed" : undefined}
                        locale={i18n.language as "nb" | "nn" | "en"}
                    >
                        <UNSAFE_DatePicker.Input
                            {...fromDatePicker.inputProps}
                            label="Fra"
                            description="(dd.mm.åååå)" // todo: språknøkkel
                            error={fromDatePicker.datepickerProps.open ? undefined : fromDateError}
                        />
                    </UNSAFE_DatePicker>

                    <UNSAFE_DatePicker
                        {...toDatePicker.datepickerProps}
                        strategy={isMobile ? "fixed" : undefined}
                        locale={i18n.language as "nb" | "nn" | "en"}
                    >
                        <UNSAFE_DatePicker.Input
                            {...toDatePicker.inputProps}
                            label="Til"
                            description="(dd.mm.åååå)"
                            error={toDatePicker.datepickerProps.open ? undefined : toDateError}
                        />
                    </UNSAFE_DatePicker>
                </Fieldset>
                <RadioGroup defaultValue={filter.mottaker} legend="Velg mottaker" onChange={onMottakerChanged}>
                    <Radio value={MottakerFilter.Alle}>Alle</Radio>
                    <Radio value={MottakerFilter.MinKonto}>Min konto</Radio>
                    <Radio value={MottakerFilter.AnnenMottaker}>Annen mottaker</Radio>
                </RadioGroup>
            </>
        </Panel>
    );
};
export default UtbetalingerFilter;
