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

type Props = { valgteChip: ChipsChip };

const Liste = ({ valgteChip }: Props) => {
    const t = useTranslations("UtbetalingerChips");

    const { data: nye } = useHentNyeUtbetalinger();
    const { data: tidligere } = useHentTidligereUtbetalinger();

    const kombinert = useMemo(() => kombinertManed(nye ?? [], tidligere ?? []), [nye, tidligere]);

    const { datepickerProps, fromInputProps, toInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date(2020, 0, 1),
    });
    const [valgtDatoRekke, setvalgtDatoRekke] = useState<{ from: Date; to: Date } | null>(null);

    const onClick = () => {
        if (selectedRange?.from && selectedRange?.to)
            setvalgtDatoRekke({ from: selectedRange.from, to: selectedRange.to });
    };

    const kommende = valgteChip === "kommende";
    const egendefinert = valgteChip === "egendefinert";
    const periodeIntervall = isPeriodChip(valgteChip) ? datoIntervall(valgteChip) : null;

    const kommendeUtbetalinger = useMemo(() => {
        if (!kommende) return [];
        const tillateStatuser = new Set<ManedUtbetalingStatus>([
            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
            ManedUtbetalingStatus.STOPPET,
        ]);

        return kombinert
            .map((g) => ({
                ...g,
                utbetalingerForManed: g.utbetalingerForManed.filter((u) => tillateStatuser.has(u.status)),
            }))
            .filter((g) => g.utbetalingerForManed.length > 0);
    }, [kombinert, kommende]);

    const periodeUtbetalinger = useMemo(() => {
        if (!periodeIntervall) return [];
        return kombinert.filter((g) => erInnenforAngittDato(g, periodeIntervall));
    }, [kombinert, periodeIntervall]);

    const egendefinertUtbetalinger = useMemo(() => {
        if (!valgtDatoRekke) return [];
        return kombinert
            .map((m) => ({
                ...m,
                utbetalingerForManed: m.utbetalingerForManed.filter((u) =>
                    utbetalingInnenforDatoIntervall(u, valgtDatoRekke.from, valgtDatoRekke.to)
                ),
            }))
            .filter((m) => m.utbetalingerForManed.length > 0);
    }, [kombinert, valgtDatoRekke]);

    if (kommende) {
        return (
            <UtbetalingerListView
                tittel={t("kommende")}
                utbetalingsGruppe={kommendeUtbetalinger}
                tillateStatuser={[ManedUtbetalingStatus.PLANLAGT_UTBETALING, ManedUtbetalingStatus.STOPPET]}
                manedsUtbetalingerSummert={[ManedUtbetalingStatus.PLANLAGT_UTBETALING]}
                tomListe={<IngenUtbetalingerKommende />}
            />
        );
    }

    if (egendefinert) {
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

                {valgtDatoRekke && (
                    <UtbetalingerListView
                        tittel={t("egendefinert")}
                        utbetalingsGruppe={egendefinertUtbetalinger}
                        tillateStatuser={[
                            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                            ManedUtbetalingStatus.UTBETALT,
                            ManedUtbetalingStatus.STOPPET,
                        ]}
                        manedsUtbetalingerSummert={[
                            ManedUtbetalingStatus.UTBETALT,
                            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
                        ]}
                        tomListe={egendefinertUtbetalinger.length < 1 ? <IngenUtbetalingerPeriode /> : null}
                    />
                )}
            </VStack>
        );
    }

    return (
        <UtbetalingerListView
            tittel={t(valgteChip)}
            utbetalingsGruppe={periodeUtbetalinger}
            tillateStatuser={[ManedUtbetalingStatus.UTBETALT, ManedUtbetalingStatus.STOPPET]}
            manedsUtbetalingerSummert={[ManedUtbetalingStatus.UTBETALT]}
            tomListe={periodeUtbetalinger.length < 1 ? <IngenUtbetalingerPeriode /> : null}
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
