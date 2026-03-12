"use client";

import { HouseIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const LandingssideSnarvei = () => {
    const t = useTranslations("Snarveier");
    return (
        <li>
            <DigisosLinkCard href="/" icon={<HouseIcon aria-hidden />}>
                {t("landingsside")}
            </DigisosLinkCard>
        </li>
    );
};

export default LandingssideSnarvei;
