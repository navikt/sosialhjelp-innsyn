"use client";

import { useTranslations } from "next-intl";
import { GavelIcon } from "@navikt/aksel-icons";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const KlagerSnarvei = () => {
    const t = useTranslations("Snarveier");
    return (
        <DigisosLinkCard href="/klager" icon={<GavelIcon />}>
            {t("klager")}
        </DigisosLinkCard>
    );
};

export default KlagerSnarvei;
