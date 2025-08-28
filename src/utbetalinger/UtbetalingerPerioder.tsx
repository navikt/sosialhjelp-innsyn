"use client";
import React from "react";
import { Box, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "siste3" | "hitil" | "fjor";
}

type YearMonth = { year: number; month: number };
type MonthRange = { start: YearMonth; end: YearMonth };

const datoIntervall = (chip: "siste3" | "hitil" | "fjor"): MonthRange | null => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    switch (chip) {
        case "siste3":
            return {
                start: { year, month: Math.max(1, month - 2) },
                end: { year, month },
            };
        case "hitil":
            return {
                start: { year, month: 1 },
                end: { year, month },
            };
        case "fjor":
            return {
                start: { year: year - 1, month: 1 },
                end: { year: year - 1, month: 12 },
            };
        default:
            return null;
    }
};

const isWithinRange = (item: NyeOgTidligereUtbetalingerResponse, range: MonthRange | null) => {
    if (!range) return true;
    const itemDate = item.ar * 100 + item.maned;
    const startDate = range.start.year * 100 + range.start.month;
    const endDate = range.end.year * 100 + range.end.month;
    return itemDate >= startDate && itemDate <= endDate;
};

const ShowUtbetalinger = (filtered: NyeOgTidligereUtbetalingerResponse[] | undefined) => {
    const t = useTranslations("utbetalinger");
    return filtered && filtered.length > 0 ? (
        filtered?.map((item, index) => (
            <UtbetalingerTitleCard
                key={index}
                utbetalinger={item}
                index={index}
                statusFilter={(u) =>
                    u.status === ManedUtbetalingStatus.UTBETALT || u.status === ManedUtbetalingStatus.STOPPET
                }
                manedsUtbetalingSum={ManedUtbetalingStatus.UTBETALT}
            />
        ))
    ) : (
        <Box.New background="neutral-soft" padding="space-24">
            <VStack gap="4">
                <Heading size="xsmall" level="3">
                    {t("ingenUtbetalinger.egendefinert.tittel")}
                </Heading>
                <p>{t("ingenUtbetalinger.egendefinert.beskrivelse")}</p>
            </VStack>
        </Box.New>
    );
};

export const UtbetalingerPerioder = ({ tidligere, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");

    const range = selectedChip ? datoIntervall(selectedChip) : null;
    const filtered = tidligere?.filter((item) => isWithinRange(item, range));

    return (
        <VStack gap="4">
            <Heading size="small" level="2">
                {t("utbetalingerSide.perioder." + selectedChip)}
            </Heading>
            {ShowUtbetalinger(filtered)}
        </VStack>
    );
};

export const UtbetalingerPerioderSkeleton = () => {
    return (
        <Box>
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
        </Box>
    );
};
