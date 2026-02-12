import { BodyShort, BoxNew, Heading, HStack, VStack } from "@navikt/ds-react";
import { useFormatter } from "next-intl";

import { ManedMedUtbetalinger } from "../../_types/types";

import { UtbetalingerContentCard } from "./UtbetalingerContentCard";

interface Props {
    manedMedUtbetalinger: ManedMedUtbetalinger;
    erKommende?: boolean;
}

export const UtbetalingerCard = ({ manedMedUtbetalinger, erKommende = false }: Props) => {
    const format = useFormatter();

    const utbetalingerForManed = manedMedUtbetalinger.utbetalinger;

    if (utbetalingerForManed.length === 0) return null;

    const utbetalingSum = utbetalingerForManed
        .filter((it) => !["STOPPET", "ANNULLERT"].includes(it.status))
        .reduce((acc, utbetaling) => acc + utbetaling.belop, 0);

    const sorterteUtbetalinger = erKommende ? utbetalingerForManed : utbetalingerForManed.toReversed();

    return (
        <VStack gap="space-2">
            <BoxNew
                borderRadius="xlarge xlarge 0 0"
                paddingInline="4"
                paddingBlock="space-12"
                className="bg-[var(--ax-bg-accent-softA)]"
            >
                <HStack className="pr-2" align="center">
                    <Heading size="small" level="3" className="capitalize">
                        {format.dateTime(new Date(manedMedUtbetalinger.ar, manedMedUtbetalinger.maned - 1, 10), {
                            month: "long",
                            year: "numeric",
                        })}
                    </Heading>
                    <BodyShort className="ml-auto tabular-nums" weight="semibold">
                        {format.number(utbetalingSum)} kr
                    </BodyShort>
                </HStack>
            </BoxNew>
            {sorterteUtbetalinger.map((utb, index) => (
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
