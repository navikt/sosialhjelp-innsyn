import { BodyShort, BoxNew, HStack, VStack } from "@navikt/ds-react";
import { set } from "date-fns";
import React from "react";
import { useFormatter } from "next-intl";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerCard } from "./UtbetalingerCard";

interface Props {
    utbetalinger: NyeOgTidligereUtbetalingerResponse;
    index: number;
}

export const UtbetalingerTitleCard = ({ utbetalinger, index }: Props) => {
    const format = useFormatter();

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
                    <BodyShort className="ml-auto">
                        {utbetalinger.utbetalingerForManed
                            .filter((utb) => utb.status === "UTBETALT")
                            .reduce((acc, utb) => acc + utb.belop, 0)}{" "}
                        kr
                    </BodyShort>
                </HStack>
            </BoxNew>
            {utbetalinger.utbetalingerForManed.map((utb, id) => (
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
