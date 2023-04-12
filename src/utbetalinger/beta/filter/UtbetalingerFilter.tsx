import React from "react";
/* eslint-disable react/jsx-pascal-case */
import {Fieldset, Panel, Radio, RadioGroup, UNSAFE_DatePicker, UNSAFE_useDatepicker} from "@navikt/ds-react";
import styles from "./utbetalingerFilter.module.css";
import {MottakerFilter, useFilter} from "./FilterContext";

const UtbetalingerFilter = () => {
    const {filter, oppdaterFilter} = useFilter();

    const fromDatePicker = UNSAFE_useDatepicker({
        toDate: filter.tilDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, fraDato: dato});
        },
    });
    const toDatePicker = UNSAFE_useDatepicker({
        fromDate: filter.fraDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, tilDato: dato});
        },
    });

    const onMottakerChanged = (values: MottakerFilter) => {
        oppdaterFilter({...filter, mottaker: values});
    };
    return (
        <Panel as="section" aria-label="Filtrer utbetalinger" className={styles.utbetalinger_filter}>
            <>
                <Fieldset legend="Filtrer på utbetalingsdato" className={styles.periodevelger}>
                    <UNSAFE_DatePicker {...fromDatePicker.datepickerProps}>
                        <UNSAFE_DatePicker.Input
                            {...fromDatePicker.inputProps}
                            label="Fra"
                            description="(dd.mm.åååå)"
                        />
                    </UNSAFE_DatePicker>
                    <UNSAFE_DatePicker {...toDatePicker.datepickerProps}>
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
