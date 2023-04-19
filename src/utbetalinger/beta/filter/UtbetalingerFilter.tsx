import React, {useEffect} from "react";
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

    const fromDatePicker = UNSAFE_useDatepicker({
        fromDate: subtractMonths(new Date(), 15),
        toDate: filter.tilDato,
        defaultSelected: filter.fraDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, fraDato: dato});
        },
    });
    const toDatePicker = UNSAFE_useDatepicker({
        fromDate: filter.fraDato,
        defaultSelected: filter.tilDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, tilDato: dato});
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
                        />
                    </UNSAFE_DatePicker>

                    <UNSAFE_DatePicker
                        {...toDatePicker.datepickerProps}
                        strategy={isMobile ? "fixed" : undefined}
                        locale={i18n.language as "nb" | "nn" | "en"}
                    >
                        <UNSAFE_DatePicker.Input {...toDatePicker.inputProps} label="Til" description="(dd.mm.åååå)" />
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
