"use client";

import { Button, Chips, DatePicker, Heading, HStack, useDatepicker, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { useTranslations } from "next-intl";
import React, { useReducer } from "react";
import { endOfDay, interval, startOfMonth, subMonths } from "date-fns";

import UtbetalingerListe from "./list/UtbetalingerListe";
import { reducer, initialState, options } from "./utbetalingerReducer";

const today = new Date();
const earliest = startOfMonth(subMonths(today, 15));

const toInterval = (from?: Date, to?: Date) => (from && to ? interval(from, endOfDay(to)) : undefined);

const Utbetalinger = () => {
    const t = useTranslations("Utbetalinger");
    const [state, dispatch] = useReducer(reducer, initialState);

    const {
        datepickerProps: fraPicker,
        inputProps: fraInput,
        selectedDay: fra,
    } = useDatepicker({
        defaultMonth: today,
        fromDate: earliest,
    });

    const {
        datepickerProps: tilPicker,
        inputProps: tilInput,
        selectedDay: til,
    } = useDatepicker({
        defaultMonth: today,
        fromDate: earliest,
    });

    const fraProps = { ...fraPicker, toDate: til };
    const tilProps = { ...tilPicker, fromDate: fra ?? earliest };

    return (
        <VStack gap="16">
            <VStack gap="4">
                <Heading size="medium" level="2">
                    {t("periode")}
                </Heading>
                <Chips>
                    {options.map((chip) => (
                        <ChipsToggle
                            key={chip}
                            checkmark={false}
                            selected={state.selectedChip === chip}
                            onClick={() => {
                                if (chip === "egendefinert") {
                                    dispatch({
                                        type: "setEgendefinert",
                                        payload: { chip, interval: toInterval(fra, til) },
                                    });
                                } else {
                                    dispatch({ type: "updateAndRender", payload: { chip } });
                                }
                            }}
                        >
                            {t(chip)}
                        </ChipsToggle>
                    ))}
                </Chips>
            </VStack>
            {state.selectedChip === "egendefinert" && (
                <HStack gap="4" align="end">
                    <HStack gap="4">
                        <DatePicker {...fraProps}>
                            <DatePicker.Input {...fraInput} label={t("fra")} />
                        </DatePicker>
                        <DatePicker {...tilProps}>
                            <DatePicker.Input {...tilInput} label={t("til")} />
                        </DatePicker>
                    </HStack>
                    <Button
                        onClick={() => {
                            dispatch({
                                type: "updateInterval",
                                payload: { chip: "egendefinert", interval: toInterval(fra, til) },
                            });
                        }}
                        disabled={!fra || !til}
                    >
                        {t("visUtbetalinger")}
                    </Button>
                </HStack>
            )}
            <UtbetalingerListe selectedState={state.state} />
        </VStack>
    );
};

export default Utbetalinger;
