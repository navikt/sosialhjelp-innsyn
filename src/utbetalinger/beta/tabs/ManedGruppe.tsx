import { Accordion, BodyShort } from "@navikt/ds-react";
import { I18n, useTranslation } from "next-i18next";
import { set } from "date-fns";

import { UtbetalingerResponseMedId } from "../UtbetalingerPanelBeta";

import UtbetalingAccordionItem from "./UtbetalingAccordionItem";

const getMonthYearString = (i18n: I18n, date: Date) =>
    date.toLocaleString(i18n.language, { month: "long", year: "numeric" });

export const ManedGruppe = ({
    utbetalingSak: { ar, maned, utbetalingerForManed },
}: {
    utbetalingSak: UtbetalingerResponseMedId;
}) => {
    const { i18n } = useTranslation();

    return (
        <section className="mb-10">
            <BodyShort className="font-bold mb-1 capitalize">
                {getMonthYearString(i18n, set(new Date(0), { year: ar, month: maned - 1 }))}
            </BodyShort>
            <Accordion>
                {utbetalingerForManed.map((utbetalingManed) => (
                    <UtbetalingAccordionItem key={utbetalingManed.id} utbetalingManed={utbetalingManed} />
                ))}
            </Accordion>
        </section>
    );
};
