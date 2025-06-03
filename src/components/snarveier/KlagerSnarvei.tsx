import React from "react";
import { getTranslations } from "next-intl/server";
import { GavelIcon } from "@navikt/aksel-icons";

import Snarvei from "./Snarvei";

const KlagerSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <Snarvei href="/klager">
            <GavelIcon />
            {t("klager")}
        </Snarvei>
    );
};

export default KlagerSnarvei;
