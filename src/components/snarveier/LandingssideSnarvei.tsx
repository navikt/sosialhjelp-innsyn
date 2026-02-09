"use client";

import { HouseIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const LandingssideSnarvei = () => {
    const t = useTranslations("Snarveier");
    return (
        <DigisosLinkCard href="/" icon={<HouseIcon aria-hidden />}>
            {t("landingsside")}
        </DigisosLinkCard>
    );
};

export default LandingssideSnarvei;
