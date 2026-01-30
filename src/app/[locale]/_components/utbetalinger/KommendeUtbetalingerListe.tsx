"use client";

import ExpandableList from "@components/showmore/ExpandableList";
import { ManedUtbetaling } from "@generated/model";
import { useTranslations } from "next-intl";
import KommendeUtbetalingCard from "./KommendeUtbetalingCard";

interface Props {
    alleKommende: ManedUtbetaling[];
}

const KommendeUtbetalingerListe = ({ alleKommende }: Props) => {
    const t = useTranslations("KommendeUtbetalingerListe");

    return (
        <ExpandableList items={alleKommende} id="kommende-utbetalinger" showMoreSuffix={t("utbetalinger")}>
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
