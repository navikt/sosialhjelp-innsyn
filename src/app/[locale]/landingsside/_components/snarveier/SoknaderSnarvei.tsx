"use client";

import { FilesIcon } from "@navikt/aksel-icons";
import { useLocale, useTranslations } from "next-intl";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const SoknaderSnarvei = () => {
    const t = useTranslations("Snarveier");
    const locale = useLocale();
    return (
        <DigisosLinkCard href={`/${locale}/soknader`} icon={<FilesIcon />}>
            {t("soknader")}
        </DigisosLinkCard>
    );
};

export default SoknaderSnarvei;
