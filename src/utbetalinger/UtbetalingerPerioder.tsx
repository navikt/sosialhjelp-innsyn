"use client";
import React from "react";
import { BodyShort, BoxNew, ExpansionCard, Heading, HStack, VStack } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
import { set } from "date-fns";
import { Link } from "@navikt/ds-react/Link";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "siste3" | "hitil" | "fjor";
}

type YearMonth = { year: number; month: number };
type MonthRange = { start: YearMonth; end: YearMonth };

const getDateRange = (chip: "siste3" | "hitil" | "fjor"): MonthRange | null => {
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

const UtbetalingerPerioder = ({ tidligere, selectedChip }: Props) => {
    const format = useFormatter();
    const t = useTranslations("utbetalinger");

    const range = selectedChip ? getDateRange(selectedChip) : null;
    const filtered = tidligere?.filter((item) => isWithinRange(item, range));

    return (
        <VStack gap="5">
            <Heading size="small" level="2">
                {t("utbetalingerSide.perioder." + selectedChip)}
            </Heading>
            {filtered?.map((item, index) => (
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
                                {item.utbetalingerForManed.reduce((acc, utb) => acc + utb.belop, 0)} kr
                            </BodyShort>
                        </HStack>
                    </BoxNew>
                    {item.utbetalingerForManed.map((utb, id) => (
                        <ExpansionCard
                            key={id}
                            aria-label="Utbetalinger"
                            data-color="info"
                            className={
                                item.utbetalingerForManed.length === 1
                                    ? "border-0 rounded-t-none rounded-b-lg"
                                    : id === 0
                                      ? "border-0 rounded-none"
                                      : id === item.utbetalingerForManed.length - 1
                                        ? "border-0 rounded-t-none rounded-b-lg"
                                        : "border-0 rounded-t-none rounded-b-lg"
                            }
                        >
                            <ExpansionCard.Header>
                                <ExpansionCard.Title>
                                    <HStack gap="4" align="center">
                                        <BodyShort size="medium" weight="semibold">
                                            {utb.tittel}
                                        </BodyShort>
                                        <HStack gap="1">
                                            <BodyShort size="small">{t("utbetalingStatus." + utb.status)}</BodyShort>
                                            <BodyShort size="small">
                                                {utb.forfallsdato
                                                    ? format.dateTime(new Date(utb.forfallsdato), {
                                                          day: "numeric",
                                                          month: "long",
                                                      })
                                                    : t("ukjentDato")}
                                            </BodyShort>
                                        </HStack>
                                        <BodyShort
                                            size="small"
                                            className="pointer-events-none absolute right-18 top-1/2 -translate-y-1/2"
                                        >
                                            {utb.belop} kr
                                        </BodyShort>
                                    </HStack>
                                </ExpansionCard.Title>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <VStack gap="3">
                                    <VStack>
                                        <BodyShort size="medium" weight="semibold">
                                            Periode:
                                        </BodyShort>
                                        <BodyShort>
                                            {utb.fom} - {utb.tom}
                                        </BodyShort>
                                    </VStack>
                                    <VStack>
                                        <BodyShort size="medium" weight="semibold">
                                            Mottaker:
                                        </BodyShort>
                                        <BodyShort>{utb.mottaker}</BodyShort>
                                    </VStack>
                                    <Link href={`soknad/${utb.fiksDigisosId}`}>Se søknaden og vedtaket du fikk</Link>
                                </VStack>
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    ))}
                </VStack>
            ))}
        </VStack>
    );
};

export default UtbetalingerPerioder;
