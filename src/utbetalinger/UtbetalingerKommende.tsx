"use client";
import { Heading, VStack, Box, Skeleton } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "kommende";
}

const ShowUtbetalinger = (nye: NyeOgTidligereUtbetalingerResponse[] | undefined) => {
    const t = useTranslations("utbetalinger");
    return nye && nye.length > 0 ? (
        nye?.map((item, index) => (
            <UtbetalingerTitleCard
                key={index}
                utbetalinger={item}
                index={index}
                statusFilter={(u) =>
                    u.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING || u.status === ManedUtbetalingStatus.STOPPET
                }
                manedsUtbetalingSum={ManedUtbetalingStatus.PLANLAGT_UTBETALING}
            />
        ))
    ) : (
        <Box.New background="neutral-soft" padding="space-24">
            <VStack gap="4">
                <Heading size="xsmall" level="3">
                    {t("ingenUtbetalinger.kommende.tittel")}
                </Heading>
                <p>{t("ingenUtbetalinger.kommende.beskrivelse1")}</p>
                <p>{t("ingenUtbetalinger.kommende.beskrivelse2")}</p>
            </VStack>
        </Box.New>
    );
};

export const UtbetalingerKommende = ({ nye, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");

    return (
        <VStack gap="4">
            <Heading size="small" level="2">
                {t("utbetalingerSide.perioder." + selectedChip)}
            </Heading>
            {ShowUtbetalinger(nye)}
        </VStack>
    );
};

export const UtbetalingerKommendeSkeleton = () => {
    return (
        <Box>
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="rectangle" />
        </Box>
    );
};
