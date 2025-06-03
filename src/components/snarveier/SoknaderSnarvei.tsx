import React from "react";
import { TasklistIcon } from "@navikt/aksel-icons";
import { getTranslations } from "next-intl/server";

import Snarvei from "./Snarvei";

const SoknaderSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <Snarvei href="/soknader">
            <TasklistIcon />
            {t("soknader")}
        </Snarvei>
    );
};

export default SoknaderSnarvei;
