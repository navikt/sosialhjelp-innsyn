import { Accordion, BodyShort } from "@navikt/ds-react";
import { useFormatter } from "next-intl";
import { set } from "date-fns";
import { useMemo } from "react";

import { NyeOgTidligereUtbetalingerResponse } from "../../generated/model";
import { isLessThanTwoWeeksAgo } from "../isLessThanTwoWeeksAgo";

import { UtbetalingAccordionHeader } from "./UtbetalingAccordionHeader";
import { UtbetalingAccordionContent } from "./UtbetalingAccordionContent";

export const UtbetalingerMonthlyList = ({
    utbetalingSak: { ar, maned, utbetalingerForManed },
}: {
    utbetalingSak: NyeOgTidligereUtbetalingerResponse;
}) => {
    const format = useFormatter();

    const utbetalingerMedId = useMemo(
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
                {format.dateTime(
                    set(new Date(0), {
                        year: ar,
                        month: maned - 1,
                    }),
                    {
                        month: "long",
                        year: "numeric",
                    }
                )}
            </BodyShort>
            <Accordion>
                {utbetalingerMedId.map((utbetaling) => (
                    <Accordion.Item
                        key={utbetaling.uuid}
                        defaultOpen={isLessThanTwoWeeksAgo(utbetaling.utbetalingsdato)}
                    >
                        <UtbetalingAccordionHeader
                            dato={utbetaling.utbetalingsdato ?? utbetaling.forfallsdato}
                            tittel={utbetaling.tittel}
                            belop={utbetaling.belop}
                            status={utbetaling.status}
                        />
                        <UtbetalingAccordionContent
                            fom={utbetaling.fom}
                            tom={utbetaling.tom}
                            mottaker={utbetaling.mottaker}
                            annenMottaker={utbetaling.annenMottaker}
                            utbetalingsmetode={utbetaling.utbetalingsmetode}
                            kontonummer={utbetaling.kontonummer}
                            fiksDigisosId={utbetaling.fiksDigisosId}
                        />
                    </Accordion.Item>
                ))}
            </Accordion>
        </section>
    );
};
