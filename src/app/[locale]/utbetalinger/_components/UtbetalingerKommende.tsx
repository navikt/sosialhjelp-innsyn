"use client";
import { Heading, VStack, Box, Skeleton } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ManedUtbetaling, ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";
import IngenUtbetalinger from "./IngenUtbetalinger";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip: "kommende";
}

const ShowUtbetalinger = ({ nye }: { nye: NyeOgTidligereUtbetalingerResponse[] | undefined }) => {
    const filteredUtbetalinger = nye
        ?.flatMap((item: NyeOgTidligereUtbetalingerResponse) => item.utbetalingerForManed)
        .filter(
            (utbetaling: ManedUtbetaling) =>
                utbetaling.status === "PLANLAGT_UTBETALING" || utbetaling.status === "STOPPET"
        );

    return filteredUtbetalinger && filteredUtbetalinger.length > 0 ? (
        nye?.map((item, index) => (
            <UtbetalingerTitleCard
                key={index}
                utbetalinger={item}
                index={index}
                allowedStatuses={[ManedUtbetalingStatus.PLANLAGT_UTBETALING, ManedUtbetalingStatus.STOPPET]}
                manedsUtbetalingSum={[ManedUtbetalingStatus.PLANLAGT_UTBETALING]}
            />
        ))
    ) : (
        <IngenUtbetalinger />
    );
};

export const UtbetalingerKommende = ({ nye, selectedChip }: Props) => {
    const t = useTranslations("UtbetalingerChips");

    return (
        <>
            <Heading size="small" level="2">
                {t(selectedChip)}
            </Heading>
            <ShowUtbetalinger nye={nye} />
        </>
    );
};

export const UtbetalingerKommendeSkeleton = () => {
    return (
        <Box>
            <VStack gap="1">
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
            </VStack>
        </Box>
    );
};
