import React from "react";
import { TasklistIcon } from "@navikt/aksel-icons";
import { getTranslations } from "next-intl/server";

import StatusCard from "@components/statusCard/StatusCard";

const SoknaderSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <StatusCard href="/soknader" icon={<TasklistIcon />}>
            {t("soknader")}
        </StatusCard>
    );
};

export default SoknaderSnarvei;
