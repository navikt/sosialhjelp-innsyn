"use client";

import { useMemo, useState } from "react";
import { DatePicker, Button, HStack, VStack } from "@navikt/ds-react";
import { useRangeDatepicker } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import {
    useHentNyeUtbetalingerSuspense,
    useHentTidligereUtbetalingerSuspense,
} from "@generated/utbetalinger-controller/utbetalinger-controller";
import { ManedUtbetalingStatus } from "@generated/ssr/model";

import type { ChipsChip } from "./Utbetalinger";
import {
    kombinertManed,
    erPeriodeChip,
    datoIntervall,
    erInnenforAngittPeriode,
    utbetalingInnenforValgtDatoIntervall,
} from "./utbetalinger-utils";
import UtbetalingerListView from "./UtbetalingerListView";
import IngenUtbetalingerKommende from "./IngenUtbetalingerKommende";
import IngenUtbetalingerPeriode from "./IngenUtbetalingerPeriode";

type Props = { valgteChip: ChipsChip };

const Liste = ({ valgteChip }: Props) => {
    const t = useTranslations("UtbetalingerChips");

    const { data: nye } = useHentNyeUtbetalingerSuspense();
    const { data: tidligere } = useHentTidligereUtbetalingerSuspense();

    const kombinert = useMemo(() => kombinertManed(nye, tidligere), [nye, tidligere]);

    const { datepickerProps, fromInputProps, toInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date(2020, 0, 1),
    });
    const [valgtDatoRekke, setvalgtDatoRekke] = useState<{ from: Date; to: Date } | null>(null);

    const onClick = () => {
        if (selectedRange?.from && selectedRange?.to)
            setvalgtDatoRekke({ from: selectedRange.from, to: selectedRange.to });
    };

    const kommende = valgteChip === "kommende.kort";
    const egendefinert = valgteChip === "egendefinert";
    const periodeIntervall = erPeriodeChip(valgteChip) ? datoIntervall(valgteChip) : null;

    const kommendeUtbetalinger = useMemo(() => {
        if (!kommende) return [];
        const tillateStatuser = new Set<ManedUtbetalingStatus>([
            ManedUtbetalingStatus.PLANLAGT_UTBETALING,
            ManedUtbetalingStatus.STOPPET,
        ]);
        // Bruker nye[] i stede for kombinert  for å unngå å vise utbetalinger som ligger i tidligere med status "stoppet"
        const nyeKilde = nye ?? [];
        return nyeKilde
            .map((g) => ({
                ...g,
                utbetalingerForManed: g.utbetalingerForManed.filter((u) => tillateStatuser.has(u.status)),
            }))
            .filter((g) => g.utbetalingerForManed.length > 0);
    }, [nye, kommende]);

    const periodeUtbetalinger = useMemo(() => {
        if (!periodeIntervall) return [];
        const tillateStatuser = new Set<ManedUtbetalingStatus>([
            ManedUtbetalingStatus.UTBETALT,
            ManedUtbetalingStatus.STOPPET,
        ]);
        return kombinert
            .filter((g) => erInnenforAngittPeriode(g, periodeIntervall))
            .map((g) => ({
                ...g,
                utbetalingerForManed: g.utbetalingerForManed.filter((u) => tillateStatuser.has(u.status)),
            }))
            .filter((g) => g.utbetalingerForManed.length > 0);
    }, [kombinert, periodeIntervall]);

    const egendefinertUtbetalinger = useMemo(() => {
        if (!valgtDatoRekke) return [];
        return kombinert
            .map((m) => ({
                ...m,
                utbetalingerForManed: m.utbetalingerForManed.filter((u) =>
                    utbetalingInnenforValgtDatoIntervall(u, valgtDatoRekke.from, valgtDatoRekke.to)
                ),
            }))
            .filter((m) => m.utbetalingerForManed.length > 0);
    }, [kombinert, valgtDatoRekke]);

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

const UtbetalingerListe = (props: Props) => {
    return <Liste {...props} />;
};

export default UtbetalingerListe;
