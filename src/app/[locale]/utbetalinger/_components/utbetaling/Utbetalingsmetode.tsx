"use client";

import React from "react";
import { useTranslations } from "next-intl";

import type { ManedUtbetaling } from "@generated/ssr/model";

import { formaterKontonummer } from "../../_utils/utbetalinger-utils";

interface Props {
    utbetaling: ManedUtbetaling;
}

export const Utbetalingsmetode = ({ utbetaling }: Props) => {
    const t = useTranslations("UtbetalingerContentCard");

    const konto = formaterKontonummer(utbetaling.kontonummer);
    const metode = utbetaling.utbetalingsmetode;

    if (utbetaling.annenMottaker) {
        const navn = (utbetaling.mottaker ?? "").trim();
        return <>{navn ? t("utbetalesTil", { mottaker: navn }) : t("utbetalesTilUkjent")}</>;
    }

    if (metode && konto) {
        if (/konto/i.test(metode)) {
            return <>{t("bankkonto", { konto })}</>;
        }
        return (
            <>
                <span>{metode}</span>
                {": "}
                <span>{konto}</span>
            </>
        );
    }

    if (metode) return <span>{metode}</span>;
    if (konto) return <>{t("bankkonto", { konto })}</>;

    return <>{t("tilDeg")}</>;
};
