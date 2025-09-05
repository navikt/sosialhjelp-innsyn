"use client";
import React, { useMemo } from "react";
import { BodyShort, Box, BoxNew, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";
import { datoIntervall, erInnenforAngittDato, kombinertManed } from "./utbetalinger-utils";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip: "siste3" | "hittil" | "fjor";
}

const ShowUtbetalinger = ({ filtered }: { filtered: NyeOgTidligereUtbetalingerResponse[] | undefined }) => {
    const t = useTranslations("IngenPeriodeUtbetalinger");
    return filtered && filtered.length > 0 ? (
        filtered?.map((item, index) => (
            <UtbetalingerTitleCard
                key={index}
                utbetalinger={item}
                index={index}
                allowedStatuses={[ManedUtbetalingStatus.UTBETALT, ManedUtbetalingStatus.STOPPET]}
                manedsUtbetalingSum={[ManedUtbetalingStatus.UTBETALT]}
            />
        ))
    ) : (
        <BoxNew background="accent-soft" padding="space-24">
            <VStack gap="4">
                <Heading size="xsmall" level="3">
                    {t("tittel")}
                </Heading>
                <BodyShort>{t("beskrivelse")}</BodyShort>
            </VStack>
        </BoxNew>
    );
};

export const UtbetalingerPerioder = ({ nye, tidligere, selectedChip }: Props) => {
    const t = useTranslations("UtbetalingerChips");

    const range = selectedChip ? datoIntervall(selectedChip) : null;
    const kombinert = useMemo(() => kombinertManed(nye ?? [], tidligere ?? []), [nye, tidligere]);
    const filtrert = kombinert?.filter((item) => erInnenforAngittDato(item, range));

    return (
        <VStack gap="4">
            <Heading size="small" level="2">
                {t(selectedChip)}
            </Heading>
            <ShowUtbetalinger filtered={filtrert} />
        </VStack>
    );
};

export const UtbetalingerPerioderSkeleton = () => {
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
