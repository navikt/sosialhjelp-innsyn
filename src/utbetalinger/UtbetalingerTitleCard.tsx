import { BodyShort, BoxNew, HStack, VStack } from "@navikt/ds-react";
import { set } from "date-fns";
import React from "react";
import { useFormatter } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerCard } from "./UtbetalingerCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    index: number;
    statusFilter?: (u: ManedUtbetaling) => boolean;
    manedsUtbetalingSum?: ManedUtbetalingStatus;
}

export const UtbetalingerTitleCard = ({ utbetalinger, index, statusFilter, manedsUtbetalingSum }: Props) => {
    const format = useFormatter();

    const synlig = statusFilter
        ? utbetalinger.utbetalingerForManed.filter(statusFilter)
        : utbetalinger.utbetalingerForManed;

    const utbetalingSum = synlig
        .filter((u) => manedsUtbetalingSum?.includes(u.status))
        .reduce((acc, u) => acc + u.belop, 0);

    return (
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
                                year: utbetalinger.ar,
                                month: utbetalinger.maned - 1,
                            }),
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </BodyShort>
                    <BodyShort className="ml-auto">{utbetalingSum} kr</BodyShort>
                </HStack>
            </BoxNew>
            {synlig.map((utb, id) => (
                <UtbetalingerCard
                    key={id}
                    manedUtbetaling={utb}
                    id={id}
                    count={utbetalinger.utbetalingerForManed.length}
                />
            ))}
        </VStack>
    );
};
