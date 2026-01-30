"use client";

import { FilesIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

const SoknaderSnarvei = () => {
    const t = useTranslations("Snarveier");
    return (
        <li>
            <DigisosLinkCard href={`/soknader`} icon={<FilesIcon aria-hidden />}>
                {t("soknader")}
            </DigisosLinkCard>
        </li>
    );
};

export default SoknaderSnarvei;
