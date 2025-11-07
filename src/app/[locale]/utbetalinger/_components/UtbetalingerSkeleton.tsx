import { Chips, Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { ChipsToggle } from "@navikt/ds-react/Chips";
import { getTranslations } from "next-intl/server";

import UtbetalingerListeSkeleton from "./list/UtbetalingerListeSkeleton";
import { options } from "./Utbetalinger";

export const UtbetalingerSkeleton = async () => {
    const t = await getTranslations("Utbetalinger");
    return (
        <VStack gap="16">
            <VStack gap="4">
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
