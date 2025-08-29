"use client";
import React, { MouseEvent, useMemo } from "react";
import { DatePicker, Heading, HStack, useRangeDatepicker, VStack, Button, Box, BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { ManedUtbetaling, ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "egendefinert";
}

const kombinertManed = (
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

const ShowUtbetalinger = ({
    pressed,
    filteredByRange,
}: {
    pressed: boolean;
    filteredByRange?: NyeOgTidligereUtbetalingerResponse[] | undefined;
}) => {
    const t = useTranslations("utbetalinger");

    return (
        filteredByRange &&
        (pressed ? (
            filteredByRange.length > 0 ? (
                filteredByRange?.map((item, index) => (
                    <UtbetalingerTitleCard
                        key={index}
                        utbetalinger={item}
                        index={index}
                        statusFilter={(u) =>
                            u.status === ManedUtbetalingStatus.UTBETALT ||
                            u.status === ManedUtbetalingStatus.STOPPET ||
                            u.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING
                        }
                        manedsUtbetalingSum={[
                            ManedUtbetalingStatus.UTBETALT || ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                        ]}
                    />
                ))
            ) : (
                <Box.New background="neutral-soft" padding="space-24">
                    <VStack gap="4">
                        <Heading size="small" level="3">
                            {t("ingenUtbetalinger.egendefinert.tittel")}
                        </Heading>
                        <BodyShort>{t("ingenUtbetalinger.egendefinert.beskrivelse")}</BodyShort>
                    </VStack>
                </Box.New>
            )
        ) : (
            ""
        ))
    );
};

export const UtbetalingerEgendefinert = ({ nye, tidligere, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");
    const [pressed, setPressed] = React.useState(false);

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date(2020, 0, 1),
    });

    const fromDate = selectedRange?.from;
    const toDate = selectedRange?.to;

    const combinedMonths = useMemo(() => kombinertManed(nye ?? [], tidligere ?? []), [nye, tidligere]);

    const filteredByRange = useMemo(() => {
        if (!fromDate || !toDate) return [];
        return combinedMonths
            .map((m) => ({
                ...m,
                utbetalingerForManed: m.utbetalingerForManed.filter((utb) => utbetalingInRange(utb, fromDate, toDate)),
            }))
            .filter((m) => m.utbetalingerForManed.length > 0);
    }, [combinedMonths, fromDate, toDate]);

    const onClick = (event: MouseEvent) => {
        setPressed(true);
        event?.preventDefault();
    };

    return (
        <VStack gap="10">
            <HStack gap="6" align="end">
                <DatePicker {...datepickerProps}>
                    <HStack gap="4">
                        <DatePicker.Input {...fromInputProps} label={t("filter.fra")} />
                        <DatePicker.Input {...toInputProps} label={t("filter.til")} />
                    </HStack>
                </DatePicker>

                <Button variant="primary" onClick={(event) => onClick(event)}>
                    Vis utbetalinger
                </Button>
            </HStack>
            <VStack gap="4">
                {pressed && (
                    <Heading size="small" level="2">
                        {t("utbetalingerSide.perioder." + selectedChip)}
                    </Heading>
                )}
                <ShowUtbetalinger pressed={pressed} filteredByRange={filteredByRange} />
            </VStack>
        </VStack>
    );
};
