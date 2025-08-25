"use client";
import { BodyShort, BoxNew, Heading, HStack, VStack } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";
import { set } from "date-fns";
import React from "react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerCard } from "./UtbetalingerCard";

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
                            <UtbetalingerCard key={id} utbetalinger={item} manedUtbetaling={utb} id={id} />
                        ))}
                </VStack>
            ))}
        </VStack>
    );
};

export default UtbetalingerKommende;
