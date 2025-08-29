"use client";
import React, { useMemo } from "react";
import { BodyShort, Box, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "siste3" | "hitil" | "fjor";
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
                manedsUtbetalingSum={[ManedUtbetalingStatus.UTBETALT]}
            />
        ))
    ) : (
        <Box.New background="neutral-soft" padding="space-24">
            <VStack gap="4">
                <Heading size="xsmall" level="3">
                    {t("ingenUtbetalinger.egendefinert.tittel")}
                </Heading>
                <BodyShort>{t("ingenUtbetalinger.egendefinert.beskrivelse")}</BodyShort>
            </VStack>
        </Box.New>
    );
};

export const UtbetalingerPerioder = ({ nye, tidligere, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");

    const range = selectedChip ? datoIntervall(selectedChip) : null;
    const combinedMonths = useMemo(() => kombinertManed(nye ?? [], tidligere ?? []), [nye, tidligere]);
    const filtered = combinedMonths?.filter((item) => isWithinRange(item, range));

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
            <VStack gap="1">
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
            </VStack>
        </Box>
    );
};
