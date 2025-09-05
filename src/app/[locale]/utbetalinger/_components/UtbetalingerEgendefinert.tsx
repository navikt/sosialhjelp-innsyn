"use client";
import React, { MouseEvent, useMemo } from "react";
import { DatePicker, Heading, useRangeDatepicker, Button, BodyShort, BoxNew } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerTitleCard } from "./UtbetalingerTitleCard";
import { kombinertManed, utbetalingInnenforDatoIntervall } from "./utbetalinger-utils";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    nye?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: "egendefinert";
}

const ShowUtbetalinger = ({
    pressed,
    filteredByRange,
}: {
    pressed: boolean;
    filteredByRange?: NyeOgTidligereUtbetalingerResponse[] | undefined;
}) => {
    const t = useTranslations("utbetalinger");

    return (
        filteredByRange &&
        (pressed ? (
            filteredByRange.length > 0 ? (
                filteredByRange?.map((item, index) => (
                    <UtbetalingerTitleCard
                        key={index}
                        utbetalinger={item}
                        index={index}
                        allowedStatuses={[
                            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                            ManedUtbetalingStatus.UTBETALT,
                            ManedUtbetalingStatus.STOPPET,
                        ]}
                        manedsUtbetalingSum={[
                            ManedUtbetalingStatus.UTBETALT,
                            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                        ]}
                    />
                ))
            ) : (
                <BoxNew background="accent-soft" padding="space-24">
                    <Heading size="small" level="3">
                        {t("ingenUtbetalinger.egendefinert.tittel")}
                    </Heading>
                    <BodyShort>{t("ingenUtbetalinger.egendefinert.beskrivelse")}</BodyShort>
                </BoxNew>
            )
        ) : (
            ""
        ))
    );
};

export const UtbetalingerEgendefinert = ({ nye, tidligere, selectedChip }: Props) => {
    const t = useTranslations("utbetalinger");
    const [pressed, setPressed] = React.useState(false);

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date(2020, 0, 1),
    });

    const fromDate = selectedRange?.from;
    const toDate = selectedRange?.to;

    const kombinert = useMemo(() => kombinertManed(nye ?? [], tidligere ?? []), [nye, tidligere]);

    const filtrertAvDatoIntervall = useMemo(() => {
        if (!fromDate || !toDate) return [];
        return kombinert
            .map((m) => ({
                ...m,
                utbetalingerForManed: m.utbetalingerForManed.filter((utb) =>
                    utbetalingInnenforDatoIntervall(utb, fromDate, toDate)
                ),
            }))
            .filter((m) => m.utbetalingerForManed.length > 0);
    }, [kombinert, fromDate, toDate]);

    const onClick = (event: MouseEvent) => {
        setPressed(true);
        event?.preventDefault();
    };

    return (
        <>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input {...fromInputProps} label={t("filter.fra")} />
                <DatePicker.Input {...toInputProps} label={t("filter.til")} />
            </DatePicker>

            <Button variant="primary" onClick={(event) => onClick(event)}>
                {t("visUtbetalinger")}
            </Button>
            {pressed && (
                <Heading size="small" level="2">
                    {t("utbetalingerSide.perioder." + selectedChip)}
                </Heading>
            )}
            <ShowUtbetalinger pressed={pressed} filteredByRange={filtrertAvDatoIntervall} />
        </>
    );
};
