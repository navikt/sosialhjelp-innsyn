"use client";
import { Heading, VStack, Box, Skeleton, BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ManedUtbetaling, ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "kommende";
}

const ShowUtbetalinger = ({ nye }: { nye: NyeOgTidligereUtbetalingerResponse[] | undefined }) => {
    const t = useTranslations("utbetalinger");
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
                statusFilter={(u) =>
                    u.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING || u.status === ManedUtbetalingStatus.STOPPET
                }
                manedsUtbetalingSum={[ManedUtbetalingStatus.PLANLAGT_UTBETALING]}
            />
        ))
    ) : (
        <Box.New background="accent-soft" padding="space-24">
            <VStack gap="4">
                <Heading size="xsmall" level="3">
                    {t("ingenUtbetalinger.kommende.tittel")}
                </Heading>
                <BodyShort>{t("ingenUtbetalinger.kommende.beskrivelse1")}</BodyShort>
                <BodyShort>{t("ingenUtbetalinger.kommende.beskrivelse2")}</BodyShort>
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
            <ShowUtbetalinger nye={nye} />
        </VStack>
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
