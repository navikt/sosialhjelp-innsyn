import { BodyShort, BoxNew, HStack, VStack } from "@navikt/ds-react";
import { set } from "date-fns";
import React from "react";
import { useFormatter } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerCard } from "./UtbetalingerCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    index: number;
    allowedStatuses?: ManedUtbetalingStatus[];
    manedsUtbetalingSum?: ManedUtbetalingStatus[];
}

export const UtbetalingerTitleCard = ({ utbetalinger, index, allowedStatuses, manedsUtbetalingSum }: Props) => {
    const format = useFormatter();

    const synlig = allowedStatuses
        ? utbetalinger.utbetalingerForManed.filter((u) => allowedStatuses.includes(u.status))
        : utbetalinger.utbetalingerForManed;

    const utbetalingSum = synlig
        .filter((u) => !manedsUtbetalingSum || manedsUtbetalingSum.includes(u.status))
        .reduce((acc, u) => acc + u.belop, 0);

    return (
        <VStack key={index} gap="1">
            {synlig.length > 0 && (
                <BoxNew
                    borderRadius="xlarge xlarge 0 0"
                    padding="space-16"
                    background="accent-soft"
                    key={`tidligere-${index}`}
                >
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
                <UtbetalingerCard key={id} manedUtbetaling={utb} id={id} count={synlig.length} />
            ))}
        </VStack>
    );
};
