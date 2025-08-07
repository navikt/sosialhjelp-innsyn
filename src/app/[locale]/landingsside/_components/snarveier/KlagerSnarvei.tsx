import React from "react";
import { getTranslations } from "next-intl/server";
import { GavelIcon } from "@navikt/aksel-icons";

import StatusCard from "@components/statusCard/StatusCard";

const KlagerSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <StatusCard href="/klager" icon={<GavelIcon />}>
            {t("klager")}
        </StatusCard>
    );
};

export default KlagerSnarvei;
