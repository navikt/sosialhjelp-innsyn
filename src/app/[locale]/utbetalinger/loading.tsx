import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { UtbetalingerSkeleton } from "./_components/UtbetalingerSkeleton";

const UtbetalingerLoading = async () => {
    const t = await getTranslations("UtbetalingerPage");
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>
            <UtbetalingerSkeleton />
        </VStack>
    );
};

export default UtbetalingerLoading;
