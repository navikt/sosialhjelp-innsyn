import { Accordion, BodyShort } from "@navikt/ds-react";
import { I18n, useTranslation } from "next-i18next";
import { set } from "date-fns";
import { useMemo } from "react";

import { NyeOgTidligereUtbetalingerResponse } from "../../../generated/model";

import UtbetalingAccordionItem from "./UtbetalingAccordionItem";

const getMonthYearString = (i18n: I18n, date: Date) =>
    date.toLocaleString(i18n.language, { month: "long", year: "numeric" });

export const ManedGruppe = ({
    utbetalingSak: { ar, maned, utbetalingerForManed },
}: {
    utbetalingSak: NyeOgTidligereUtbetalingerResponse;
}) => {
    const { i18n } = useTranslation();

    const withIds = useMemo(
        () =>
            utbetalingerForManed.map((utbetaling) => ({
                ...utbetaling,
                uuid: crypto.randomUUID(),
            })),
        [utbetalingerForManed]
    );

    return (
        <section className="mb-10">
            <BodyShort className="font-bold mb-1 capitalize">
                {getMonthYearString(i18n, set(new Date(0), { year: ar, month: maned - 1 }))}
            </BodyShort>
            <Accordion>
                {withIds.map((utbetaling) => (
                    <UtbetalingAccordionItem key={utbetaling.uuid} utbetaling={utbetaling} />
                ))}
            </Accordion>
        </section>
    );
};
