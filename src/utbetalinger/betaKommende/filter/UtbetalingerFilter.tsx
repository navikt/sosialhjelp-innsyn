import React from "react";
/* eslint-disable react/jsx-pascal-case */
import {
    Checkbox,
    CheckboxGroup,
    Fieldset,
    Heading,
    Panel,
    UNSAFE_DatePicker,
    UNSAFE_useDatepicker,
} from "@navikt/ds-react";
import styles from "./utbetalingerFilter.module.css";
import {MottakerFilter, useFilter} from "./FilterContext";

const UtbetalingerFilter = () => {
    const {filter, oppdaterFilter} = useFilter();

    const fromDatePicker = UNSAFE_useDatepicker({
        fromDate: filter.fraDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, fraDato: dato});
        },
    });
    const toDatePicker = UNSAFE_useDatepicker({
        toDate: filter.tilDato,
        onDateChange: (dato?) => {
            oppdaterFilter({...filter, tilDato: dato});
        },
    });

    const onMottakerCheckboxChanged = (values: MottakerFilter[]) => {
        oppdaterFilter({...filter, mottaker: values});
    };
    return (
        <Panel className={styles.utbetalinger_filter}>
            <section aria-label="Filtrer utbetalinger">
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
                <CheckboxGroup legend="Mottaker" onChange={onMottakerCheckboxChanged}>
                    <Checkbox value="minKonto">Min konto</Checkbox>
                    <Checkbox value="annenMottaker">Annen mottaker</Checkbox>
                </CheckboxGroup>
            </section>
        </Panel>
    );
};
export default UtbetalingerFilter;
