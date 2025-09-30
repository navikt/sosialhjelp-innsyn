"use client";

import React from "react";
import { useTranslations } from "next-intl";

import type { ManedUtbetaling } from "@generated/ssr/model";

import { formaterKontonummer, erKontonummerFormatert } from "./utbetalinger-utils";

interface Props {
    utbetaling: ManedUtbetaling;
}

export const Utbetalingsmetode = ({ utbetaling }: Props) => {
    const t = useTranslations("UtbetalingerContentCard");

    const konto = erKontonummerFormatert(utbetaling.kontonummer)
        ? utbetaling.kontonummer
        : formaterKontonummer(utbetaling.kontonummer);
    const metode = utbetaling.utbetalingsmetode;

    if (utbetaling.annenMottaker) {
        const navn = (utbetaling.mottaker ?? "").trim();
        return <>{navn ? t.rich("utbetalesTil", { mottaker: navn }) : t("utbetalesTilUkjent")}</>;
    }

    if (metode && konto) {
        if (/konto/i.test(metode)) {
            return <>{t.rich("bankkonto", { norsk: (c) => <span lang="no">{c}</span>, konto })}</>;
        }
        return (
            <>
                <span>{metode}</span>
                {": "}
                <span lang="no">{konto}</span>
            </>
        );
    }

    if (metode) return <span>{metode}</span>;
    if (konto) return <>{t.rich("bankkonto", { konto })}</>;

    return <>{t("tilDeg")}</>;
};
