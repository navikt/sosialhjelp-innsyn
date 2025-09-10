"use client";

import { Suspense, useMemo, useState } from "react";
import { DatePicker, Button, HStack, VStack } from "@navikt/ds-react";
import { useRangeDatepicker } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import {
    useHentNyeUtbetalinger,
    useHentTidligereUtbetalinger,
} from "@generated/utbetalinger-controller/utbetalinger-controller";
import { ManedUtbetalingStatus } from "@generated/ssr/model";

import type { ChipsChip } from "./Utbetalinger";
import {
    kombinertManed,
    isPeriodChip,
    datoIntervall,
    erInnenforAngittDato,
    utbetalingInnenforDatoIntervall,
} from "./utbetalinger-utils";
import UtbetalingerListView from "./UtbetalingerListView";
import IngenUtbetalingerKommende from "./IngenUtbetalingerKommende";
import IngenUtbetalingerPeriode from "./IngenUtbetalingerPeriode";
import { UtbetalingerSkeleton } from "./UtbetalingerSkeleton";

type Props = { selectedChip: ChipsChip };

const Liste = ({ selectedChip }: Props) => {
    const t = useTranslations("UtbetalingerChips");

    const { data: nye } = useHentNyeUtbetalinger();
    const { data: tidligere } = useHentTidligereUtbetalinger();

    const combined = useMemo(() => kombinertManed(nye ?? [], tidligere ?? []), [nye, tidligere]);

    const { datepickerProps, fromInputProps, toInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date(2020, 0, 1),
    });
    const [applied, setApplied] = useState<{ from: Date; to: Date } | null>(null);

    const onClick = () => {
        if (selectedRange?.from && selectedRange?.to) setApplied({ from: selectedRange.from, to: selectedRange.to });
    };

    const isKommende = selectedChip === "kommende";
    const isEgendefinert = selectedChip === "egendefinert";
    const periodeRange = isPeriodChip(selectedChip) ? datoIntervall(selectedChip) : null;

    const kommendeGroups = useMemo(() => {
        if (!isKommende) return [];
        const allowed = new Set<ManedUtbetalingStatus>([
            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
            ManedUtbetalingStatus.STOPPET,
        ]);

        return combined
            .map((g) => ({ ...g, utbetalingerForManed: g.utbetalingerForManed.filter((u) => allowed.has(u.status)) }))
            .filter((g) => g.utbetalingerForManed.length > 0);
    }, [combined, isKommende]);

    const periodeGroups = useMemo(() => {
        if (!periodeRange) return [];
        return combined.filter((g) => erInnenforAngittDato(g, periodeRange));
    }, [combined, periodeRange]);

    const egendefinerteGroups = useMemo(() => {
        if (!applied) return [];
        return combined
            .map((m) => ({
                ...m,
                utbetalingerForManed: m.utbetalingerForManed.filter((u) =>
                    utbetalingInnenforDatoIntervall(u, applied.from, applied.to)
                ),
            }))
            .filter((m) => m.utbetalingerForManed.length > 0);
    }, [combined, applied]);

    if (isKommende) {
        return (
            <UtbetalingerListView
                title={t("kommende")}
                groups={kommendeGroups}
                allowedStatuses={[ManedUtbetalingStatus.PLANLAGT_UTBETALING, ManedUtbetalingStatus.STOPPET]}
                sumStatuses={[ManedUtbetalingStatus.PLANLAGT_UTBETALING]}
                empty={<IngenUtbetalingerKommende />}
            />
        );
    }

    if (isEgendefinert) {
        return (
            <VStack gap="4">
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

                {applied && (
                    <UtbetalingerListView
                        title={t("egendefinert")}
                        groups={egendefinerteGroups}
                        allowedStatuses={[
                            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                            ManedUtbetalingStatus.UTBETALT,
                            ManedUtbetalingStatus.STOPPET,
                        ]}
                        sumStatuses={[ManedUtbetalingStatus.UTBETALT, ManedUtbetalingStatus.PLANLAGT_UTBETALING]}
                        empty={egendefinerteGroups.length < 1 ? <IngenUtbetalingerPeriode /> : ""}
                    />
                )}
            </VStack>
        );
    }

    return (
        <UtbetalingerListView
            title={t(selectedChip)}
            groups={periodeGroups}
            allowedStatuses={[ManedUtbetalingStatus.UTBETALT, ManedUtbetalingStatus.STOPPET]}
            sumStatuses={[ManedUtbetalingStatus.UTBETALT]}
            empty={periodeGroups.length < 1 ? <IngenUtbetalingerPeriode /> : ""}
        />
    );
};

const UtbetalingerListe = (props: Props) => {
    return (
        <Suspense fallback={<UtbetalingerSkeleton />}>
            <Liste {...props} />
        </Suspense>
    );
};

export default UtbetalingerListe;
