import { BodyShort, BoxNew, Heading, HStack, VStack } from "@navikt/ds-react";
import React from "react";
import { useFormatter } from "next-intl";
import { parseISO } from "date-fns";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerContentCard } from "./UtbetalingerContentCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
}

export const UtbetalingerCard = ({ utbetalinger }: Props) => {
    const format = useFormatter();

    const utbetalingerForManed = utbetalinger.utbetalingerForManed;

    if (utbetalingerForManed.length === 0) return null;

    const utbetalingSum = utbetalingerForManed
        .filter((it) => !["STOPPET", "ANNULLERT"].includes(it.status))
        .reduce((acc, utbetaling) => acc + utbetaling.belop, 0);

    return (
        <VStack gap="05">
            <BoxNew borderRadius="xlarge xlarge 0 0" paddingInline="4" paddingBlock="space-12" background="accent-soft">
                <HStack className="pr-2" align="center">
                    <Heading size="small" level="3" className="capitalize">
                        {format.dateTime(parseISO(`${utbetalinger.ar}-${utbetalinger.maned}-15`), {
                            month: "long",
                            year: "numeric",
                        })}
                    </Heading>
                    <BodyShort className="ml-auto tabular-nums" weight="semibold">
                        {format.number(utbetalingSum)} kr
                    </BodyShort>
                </HStack>
            </BoxNew>
            {utbetalingerForManed.toReversed().map((utb, index) => (
                <UtbetalingerContentCard
                    index={index}
                    key={utb.referanse}
                    manedUtbetaling={utb}
                    count={utbetalingerForManed.length}
                />
            ))}
        </VStack>
    );
};
