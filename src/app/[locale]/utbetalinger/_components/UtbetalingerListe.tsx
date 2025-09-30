"use client";

import { useState } from "react";
import { DatePicker, Button, HStack, VStack } from "@navikt/ds-react";
import { useRangeDatepicker } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { startOfMonth, subMonths } from "date-fns";

import {
    useHentNyeUtbetalingerSuspense,
    useHentTidligereUtbetalingerSuspense,
} from "@generated/utbetalinger-controller/utbetalinger-controller";
import { ManedUtbetalingStatus } from "@generated/ssr/model";

import type { ChipsChip } from "./Utbetalinger";
import UtbetalingerListView from "./UtbetalingerListView";
import IngenUtbetalingerKommende from "./IngenUtbetalingerKommende";
import IngenUtbetalingerPeriode from "./IngenUtbetalingerPeriode";
import { useUtbetalingerLists } from "./useUtbetalingerListe";

type Props = { valgteChip: ChipsChip };

const UtbetalingerListe = ({ valgteChip }: Props) => {
    const t = useTranslations("UtbetalingerChips");

    const today = new Date();
    const earliest = startOfMonth(subMonths(today, 15));

    const { datepickerProps, fromInputProps, toInputProps, selectedRange } = useRangeDatepicker({
        fromDate: earliest,
        defaultMonth: today,
    });

    const kommende = valgteChip === "kommende.kort";
    const egendefinert = valgteChip === "egendefinert";

    const { data: nye } = useHentNyeUtbetalingerSuspense();
    const { data: tidligere } = useHentTidligereUtbetalingerSuspense();

    const [valgtDatointervall, setValgtDatointervall] = useState<{ from: Date; to: Date } | null>(null);
    const { kommendeUtbetalinger, periodeUtbetalinger, egendefinertUtbetalinger } = useUtbetalingerLists({
        valgteChip,
        nye,
        tidligere,
        valgtDatointervall: valgtDatointervall,
    });

    const onClick = () => {
        if (selectedRange?.from && selectedRange?.to)
            setValgtDatointervall({ from: selectedRange.from, to: selectedRange.to });
    };

    if (kommende) {
        return (
            <UtbetalingerListView
                tittel={t("kommende.lang")}
                utbetalingsGruppe={kommendeUtbetalinger}
                manedsUtbetalingerSummert={[ManedUtbetalingStatus.PLANLAGT_UTBETALING]}
                tomListe={<IngenUtbetalingerKommende />}
            />
        );
    }

    if (egendefinert) {
        return (
            <VStack gap="16">
                <HStack gap="4" align="end">
                    <DatePicker {...datepickerProps}>
                        <HStack gap="4">
                            <DatePicker.Input {...fromInputProps} label={t("fra")} />
                            <DatePicker.Input {...toInputProps} label={t("til")} />
                        </HStack>
                    </DatePicker>
                    <Button onClick={onClick} disabled={!selectedRange?.from || !selectedRange?.to}>
                        {t("visUtbetalinger")}
                    </Button>
                </HStack>
                {valgtDatointervall && (
                    <UtbetalingerListView
                        tittel={t("egendefinert")}
                        utbetalingsGruppe={egendefinertUtbetalinger}
                        manedsUtbetalingerSummert={[
                            ManedUtbetalingStatus.UTBETALT,
                            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                        ]}
                        tomListe={<IngenUtbetalingerPeriode />}
                    />
                )}
            </VStack>
        );
    }

    return (
        <UtbetalingerListView
            tittel={t(valgteChip)}
            utbetalingsGruppe={periodeUtbetalinger}
            manedsUtbetalingerSummert={[ManedUtbetalingStatus.UTBETALT]}
            tomListe={<IngenUtbetalingerPeriode />}
        />
    );
};

export default UtbetalingerListe;
