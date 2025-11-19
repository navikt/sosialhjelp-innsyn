"use client";

import { BankNoteIcon } from "@navikt/aksel-icons";
import { useLocale, useTranslations } from "next-intl";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const UtbetalingerSnarvei = () => {
    const t = useTranslations("Snarveier");
    const locale = useLocale();
    return (
        <DigisosLinkCard href={`/${locale}/utbetaling`} icon={<BankNoteIcon />}>
            {t("utbetalinger")}
        </DigisosLinkCard>
    );
};

export default UtbetalingerSnarvei;
