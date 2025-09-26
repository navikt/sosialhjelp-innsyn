import { BodyShort, BoxNew, Heading, HStack, VStack } from "@navikt/ds-react";
import { set } from "date-fns";
import React from "react";
import { useFormatter } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerContentCard } from "./UtbetalingerContentCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    manedsUtbetalingerSummert?: ManedUtbetalingStatus[];
}

export const UtbetalingerHeaderCard = ({ utbetalinger, manedsUtbetalingerSummert }: Props) => {
    const format = useFormatter();

    const utbetalingerForManed = utbetalinger.utbetalingerForManed;

    if (utbetalingerForManed.length === 0) return null;

    const utbetalingSum = utbetalingerForManed
        .filter((utbetalinger) => !manedsUtbetalingerSummert || manedsUtbetalingerSummert.includes(utbetalinger.status))
        .reduce((acc, utbetaling) => acc + utbetaling.belop, 0);

    return (
        <VStack gap="1">
            <BoxNew borderRadius="xlarge xlarge 0 0" paddingInline="4" paddingBlock="space-12" background="accent-soft">
                <HStack className="pr-2" align="center">
                    <Heading size="small" level="3" className="capitalize">
                        {format.dateTime(
                            set(new Date(0), {
                                year: utbetalinger.ar,
                                month: utbetalinger.maned - 1,
                            }),
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </Heading>
                    <BodyShort className="ml-auto tabular-nums" weight="semibold">
                        {utbetalingSum} kr
                    </BodyShort>
                </HStack>
            </BoxNew>
            {utbetalingerForManed.map((utb, index) => (
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
