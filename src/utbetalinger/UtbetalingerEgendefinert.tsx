"use client";
import React, { useMemo } from "react";
import { BodyShort, BoxNew, DatePicker, Heading, HStack, useRangeDatepicker, VStack } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
import { set } from "date-fns";

import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerCard } from "./UtbetalingerCard";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "egendefinert";
}

const combineMonths = (
    nye: NyeOgTidligereUtbetalingerResponse[] = [],
    tidligere: NyeOgTidligereUtbetalingerResponse[] = []
): NyeOgTidligereUtbetalingerResponse[] => {
    const map = new Map<string, NyeOgTidligereUtbetalingerResponse>();

    for (const list of [nye, tidligere]) {
        for (const m of list) {
            const key = `${m.ar}-${m.maned}`;
            const existing = map.get(key);
            if (existing) {
                existing.utbetalingerForManed = [...existing.utbetalingerForManed, ...m.utbetalingerForManed];
            } else {
                map.set(key, {
                    ar: m.ar,
                    maned: m.maned,
                    utbetalingerForManed: [...m.utbetalingerForManed],
                });
            }
        }
    }

    return Array.from(map.values()).sort((a, b) => (a.ar === b.ar ? a.maned - b.maned : a.ar - b.ar));
};

const utbetalingInRange = (utb: ManedUtbetaling, from: Date, to: Date): boolean => {
    const singleDateStr = utb.utbetalingsdato ?? utb.forfallsdato;
    if (singleDateStr) {
        const d = new Date(singleDateStr);
        return d >= from && d <= to;
    }

    const fom = utb.fom ? new Date(utb.fom) : undefined;
    const tom = utb.tom ? new Date(utb.tom) : undefined;

    if (fom && tom) {
        return !(tom < from || fom > to);
    }
    if (fom) return fom >= from && fom <= to;
    if (tom) return tom >= from && tom <= to;

    return true;
};

export const UtbetalingerEgendefinert = ({ nye, tidligere, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");
    const format = useFormatter();

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date(2020, 0, 1),
    });

    const fromDate = selectedRange?.from;
    const toDate = selectedRange?.to;

    const combinedMonths = useMemo(() => combineMonths(nye ?? [], tidligere ?? []), [nye, tidligere]);

    const filteredByRange = useMemo(() => {
        if (!fromDate || !toDate) return [];
        return combinedMonths
            .map((m) => ({
                ...m,
                utbetalingerForManed: m.utbetalingerForManed.filter((utb) => utbetalingInRange(utb, fromDate, toDate)),
            }))
            .filter((m) => m.utbetalingerForManed.length > 0);
    }, [combinedMonths, fromDate, toDate]);

    return (
        <VStack gap="5">
            <DatePicker {...datepickerProps}>
                <HStack>
                    <DatePicker.Input {...toInputProps} label={t("filter.fra")} />
                    <DatePicker.Input {...fromInputProps} label={t("filter.til")} />
                </HStack>
            </DatePicker>
            {filteredByRange.length > 0 && (
                <Heading size="small" level="2">
                    {t("utbetalingerSide.perioder." + selectedChip)}
                </Heading>
            )}
            {filteredByRange?.map((item, index) => (
                <VStack gap="1" key={index}>
                    <BoxNew
                        borderRadius="xlarge xlarge 0 0"
                        padding="space-16"
                        background="info-soft"
                        key={`tidligere-${index}`}
                    >
                        <HStack>
                            <BodyShort className="font-bold mb-1 capitalize">
                                {format.dateTime(
                                    set(new Date(0), {
                                        year: item.ar,
                                        month: item.maned - 1,
                                    }),
                                    {
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </BodyShort>
                            <BodyShort className="ml-auto">
                                {item.utbetalingerForManed
                                    .filter((utb) => utb.status === "UTBETALT")
                                    .reduce((acc, utb) => acc + utb.belop, 0)}{" "}
                                kr
                            </BodyShort>
                        </HStack>
                    </BoxNew>
                    {item.utbetalingerForManed.map((utb, id) => (
                        <UtbetalingerCard key={id} utbetalinger={item} manedUtbetaling={utb} id={id} />
                    ))}
                </VStack>
            ))}
        </VStack>
    );
};
