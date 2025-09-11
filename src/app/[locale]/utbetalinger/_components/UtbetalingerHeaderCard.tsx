import { BodyShort, BoxNew, Heading, HStack, VStack } from "@navikt/ds-react";
import { set } from "date-fns";
import React from "react";
import { useFormatter } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerContentCard } from "./UtbetalingerContentCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    manedsUtbetalingSummert?: ManedUtbetalingStatus[];
}

export const UtbetalingerHeaderCard = ({ utbetalinger, manedsUtbetalingSummert }: Props) => {
    const format = useFormatter();

    const synlig = utbetalinger.utbetalingerForManed;

    if (synlig.length === 0) return null;

    const utbetalingSum = synlig
        .filter((u) => !manedsUtbetalingSummert || manedsUtbetalingSummert.includes(u.status))
        .reduce((acc, u) => acc + u.belop, 0);

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
            {synlig.map((utb, id) => (
                <UtbetalingerContentCard key={id} manedUtbetaling={utb} id={id} count={synlig.length} />
            ))}
        </VStack>
    );
};
