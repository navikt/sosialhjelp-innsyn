import React from "react";
import { TasklistIcon } from "@navikt/aksel-icons";
import { getLocale, getTranslations } from "next-intl/server";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const SoknaderSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    const locale = await getLocale();
    return (
        <DigisosLinkCard href={`/${locale}/soknader`} icon={<TasklistIcon />}>
            {t("soknader")}
        </DigisosLinkCard>
    );
};

export default SoknaderSnarvei;
