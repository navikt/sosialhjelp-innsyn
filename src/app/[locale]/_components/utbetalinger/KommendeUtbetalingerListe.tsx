"use client";

import ExpandableList from "@components/showmore/ExpandableList";
import { useTranslations } from "next-intl";
import KommendeUtbetalingCard from "./KommendeUtbetalingCard";
import { UtbetalingDto } from "@generated/model";

interface Props {
    alleKommende: UtbetalingDto[];
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
            {(utbetaling, ref) => (
                <li
                    key={`${utbetaling.fiksDigisosId}-${utbetaling.utbetalingsdato}-${utbetaling.belop}`}
                    ref={ref}
                    tabIndex={-1}
                >
                    <KommendeUtbetalingCard utbetaling={utbetaling} />
                </li>
            )}
        </ExpandableList>
    );
};

export default KommendeUtbetalingerListe;
