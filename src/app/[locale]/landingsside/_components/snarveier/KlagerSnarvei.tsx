import React from "react";
import { getTranslations } from "next-intl/server";
import { GavelIcon } from "@navikt/aksel-icons";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const KlagerSnarvei = async () => {
    const t = await getTranslations("Snarveier");
    return (
        <DigisosLinkCard href="/klager" icon={<GavelIcon />}>
            {t("klager")}
        </DigisosLinkCard>
    );
};

export default KlagerSnarvei;
