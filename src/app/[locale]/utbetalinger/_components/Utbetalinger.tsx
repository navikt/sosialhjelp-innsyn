"use client";

import { Button, Chips, DatePicker, Heading, HStack, useRangeDatepicker, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { useTranslations } from "next-intl";
import React, { useReducer } from "react";
import { endOfDay, interval, startOfMonth, subMonths } from "date-fns";

import UtbetalingerListe from "./list/UtbetalingerListe";
import { reducer, initialState, options } from "./utbetalingerReducer";

const today = new Date();
const earliest = startOfMonth(subMonths(today, 15));

const toInterval = (from?: Date, to?: Date) => {
    if (!from || !to) return undefined;
    return interval(from, endOfDay(to));
};

const Utbetalinger = () => {
    const t = useTranslations("Utbetalinger");
    const [state, dispatch] = useReducer(reducer, initialState);
    const { datepickerProps, fromInputProps, toInputProps, selectedRange } = useRangeDatepicker({
        fromDate: earliest,
        defaultMonth: today,
    });
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
                                        payload: { chip, interval: toInterval(selectedRange?.from, selectedRange?.to) },
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
                    <DatePicker {...datepickerProps}>
                        <HStack gap="4">
                            <DatePicker.Input {...fromInputProps} label={t("fra")} />
                            <DatePicker.Input {...toInputProps} label={t("til")} />
                        </HStack>
                    </DatePicker>
                    <Button
                        onClick={() => {
                            dispatch({
                                type: "updateInterval",
                                payload: {
                                    chip: "egendefinert",
                                    interval: toInterval(selectedRange?.from, selectedRange?.to),
                                },
                            });
                        }}
                        disabled={!selectedRange?.from || !selectedRange?.to}
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
