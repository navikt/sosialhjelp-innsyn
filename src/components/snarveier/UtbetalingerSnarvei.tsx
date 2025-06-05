import React from "react";
import { BankNoteIcon } from "@navikt/aksel-icons";
import { getTranslations } from "next-intl/server";

import Snarvei from "./Snarvei";

const UtbetalingerSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <Snarvei href="/utbetalinger">
            <BankNoteIcon />
            {t("utbetalinger")}
        </Snarvei>
    );
};

export default UtbetalingerSnarvei;
