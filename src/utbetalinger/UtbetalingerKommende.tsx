"use client";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "kommende";
}
const UtbetalingerKommende = ({ nye, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");

    return (
        <VStack gap="5">
            <Heading size="small" level="2">
                {t("utbetalingerSide.perioder." + selectedChip)}
            </Heading>
            {nye?.map((item, index) => (
                <UtbetalingerTitleCard
                    key={index}
                    utbetalinger={item}
                    index={index}
                    statusFilter={(u) =>
                        u.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING ||
                        u.status === ManedUtbetalingStatus.STOPPET
                    }
                    manedsUtbetalingSum={ManedUtbetalingStatus.PLANLAGT_UTBETALING}
                />
            ))}
        </VStack>
    );
};

export default UtbetalingerKommende;
