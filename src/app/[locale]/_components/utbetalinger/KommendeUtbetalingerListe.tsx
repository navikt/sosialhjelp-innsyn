"use client";

import ExpandableList from "@components/showmore/ExpandableList";
import { ManedUtbetaling } from "@generated/model";
import { useTranslations } from "next-intl";
import KommendeUtbetalingCard from "./KommendeUtbetalingCard";

interface Props {
    alleKommende: ManedUtbetaling[];
    labelledById: string;
}

const KommendeUtbetalingerListe = ({ alleKommende, labelledById }: Props) => {
    const t = useTranslations("KommendeUtbetalingerListe");

    return (
        <ExpandableList
            items={alleKommende}
            id="kommende-utbetalinger"
            showMoreSuffix={t("utbetalinger")}
            labelledById={labelledById}
        >
            {(utbetaling, index, firstExpandedItemRef, itemsLimit) => (
                <KommendeUtbetalingCard
                    utbetaling={utbetaling}
                    index={index}
                    firstExpandedItemRef={firstExpandedItemRef}
                    itemsLimit={itemsLimit}
                />
            )}
        </ExpandableList>
    );
};

export default KommendeUtbetalingerListe;
