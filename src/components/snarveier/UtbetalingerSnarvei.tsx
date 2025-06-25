import React from "react";
import { BankNoteIcon } from "@navikt/aksel-icons";
import { getTranslations } from "next-intl/server";

import StatusCard from "../soknaderList/statusCard/StatusCard";

const UtbetalingerSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <StatusCard href="/utbetalinger" icon={<BankNoteIcon />}>
            {t("utbetalinger")}
        </StatusCard>
    );
};

export default UtbetalingerSnarvei;
