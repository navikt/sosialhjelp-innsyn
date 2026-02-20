import { Chips, Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { getTranslations } from "next-intl/server";

import { options } from "../_types/types";

import UtbetalingerListeSkeleton from "./list/UtbetalingerListeSkeleton";

export const UtbetalingerSkeleton = async () => {
    const t = await getTranslations("Utbetalinger");

    return (
        <VStack gap="space-64">
            <VStack gap="space-16">
                <Heading size="medium" level="2">
                    {t("periode")}
                </Heading>
                <Chips>
                    {options.map((chip) => (
                        <ChipsToggle key={chip} checkmark={false} selected={"kommende" === chip}>
                            {t(chip)}
                        </ChipsToggle>
                    ))}
                </Chips>
            </VStack>
            <UtbetalingerListeSkeleton />
        </VStack>
    );
};
