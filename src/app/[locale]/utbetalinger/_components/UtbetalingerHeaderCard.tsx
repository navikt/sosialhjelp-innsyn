import { BodyShort, BoxNew, HStack, VStack } from "@navikt/ds-react";
import { set } from "date-fns";
import React from "react";
import { useFormatter } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerContentCard } from "./UtbetalingerContentCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    allowedStatuses?: ManedUtbetalingStatus[];
    manedsUtbetalingSum?: ManedUtbetalingStatus[];
}

export const UtbetalingerHeaderCard = ({ utbetalinger, allowedStatuses, manedsUtbetalingSum }: Props) => {
    const format = useFormatter();

    const synlig = allowedStatuses
        ? utbetalinger.utbetalingerForManed.filter((u) => allowedStatuses.includes(u.status))
        : utbetalinger.utbetalingerForManed;

    const utbetalingSum = synlig
        .filter((u) => !manedsUtbetalingSum || manedsUtbetalingSum.includes(u.status))
        .reduce((acc, u) => acc + u.belop, 0);

    return (
        <VStack gap="1">
            {synlig.length > 0 && (
                <BoxNew borderRadius="xlarge xlarge 0 0" padding="space-16" background="accent-soft">
                    <HStack>
                        <BodyShort className="capitalize" weight="semibold">
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
                        </BodyShort>
                        <BodyShort className="ml-auto" weight="semibold">
                            {utbetalingSum} kr
                        </BodyShort>
                    </HStack>
                </BoxNew>
            )}
            {synlig.map((utb, id) => (
                <UtbetalingerContentCard key={id} manedUtbetaling={utb} id={id} count={synlig.length} />
            ))}
        </VStack>
    );
};
