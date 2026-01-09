"use client";

import { BankNoteIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const UtbetalingerSnarvei = () => {
    const t = useTranslations("Snarveier");
    return (
        <DigisosLinkCard href={`/utbetaling`} icon={<BankNoteIcon />}>
            {t("utbetalinger")}
        </DigisosLinkCard>
    );
};

export default UtbetalingerSnarvei;
