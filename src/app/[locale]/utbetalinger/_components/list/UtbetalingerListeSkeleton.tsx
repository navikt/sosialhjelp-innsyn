import React from "react";
import { VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import UtbetalingerCardSkeleton from "../utbetaling/UtbetalingerCardSkeleton";

import UtbetalingerListView from "./UtbetalingerListView";

const UtbetalingerListeSkeleton = async () => {
    const t = await getTranslations("UtbetalingerListe");
    const tittel = t(`tittel.kommende`);
    return (
        <VStack gap="space-64">
            <UtbetalingerListView tittel={tittel}>
                <UtbetalingerCardSkeleton />
                <UtbetalingerCardSkeleton />
            </UtbetalingerListView>
        </VStack>
    );
};

export default UtbetalingerListeSkeleton;
