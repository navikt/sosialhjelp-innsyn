"use client";
import { BodyShort, BoxNew, ExpansionCard, Heading, HStack, VStack } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
import { set } from "date-fns";
import { Link } from "@navikt/ds-react/Link";
import React from "react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "kommende";
}
const UtbetalingerKommende = ({ nye, selectedChip }: Props) => {
    const format = useFormatter();
    const t = useTranslations("utbetalinger");

    return (
        <VStack gap="5">
            <Heading size="small" level="2">
                {t("utbetalingerSide.perioder." + selectedChip)}
            </Heading>
            {nye?.map((item, index) => (
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
                                    .filter((utb) => utb.status === "PLANLAGT_UTBETALING")
                                    .reduce((acc, utb) => acc + utb.belop, 0)}{" "}
                                kr
                            </BodyShort>
                        </HStack>
                    </BoxNew>
                    {item.utbetalingerForManed
                        .filter((utb) => utb.status === "PLANLAGT_UTBETALING" || utb.status === "STOPPET")
                        .map((utb, id) => (
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
                                            ? "border-0 rounded-4xl"
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
                                                <BodyShort size="small">
                                                    {t("utbetalingStatus." + utb.status)}
                                                </BodyShort>
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
                                        <Link href={`soknad/${utb.fiksDigisosId}`}>
                                            Se søknaden og vedtaket du fikk
                                        </Link>
                                    </VStack>
                                </ExpansionCard.Content>
                            </ExpansionCard>
                        ))}
                </VStack>
            ))}
        </VStack>
    );
};

export default UtbetalingerKommende;
