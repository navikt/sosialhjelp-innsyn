"use client";

import { BankNoteIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const UtbetalingerSnarvei = () => {
    const t = useTranslations("Snarveier");
    return (
        <li>
            <DigisosLinkCard href={`/utbetaling`} icon={<BankNoteIcon aria-hidden />}>
                {t("utbetalinger")}
            </DigisosLinkCard>
        </li>
    );
};

export default UtbetalingerSnarvei;
