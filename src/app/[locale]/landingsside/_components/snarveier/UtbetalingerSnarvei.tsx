import React from "react";
import { BankNoteIcon } from "@navikt/aksel-icons";
import { getLocale, getTranslations } from "next-intl/server";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const UtbetalingerSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    const locale = await getLocale();
    return (
        <DigisosLinkCard href={`/${locale}/utbetaling`} icon={<BankNoteIcon />}>
            {t("utbetalinger")}
        </DigisosLinkCard>
    );
};

export default UtbetalingerSnarvei;
