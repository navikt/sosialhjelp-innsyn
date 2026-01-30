"use client";

import { NotePencilIcon } from "@navikt/aksel-icons";
import { browserEnv } from "@config/env";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { useTranslations } from "next-intl";

const SokButton = () => {
    const t = useTranslations("SokButton");
    return (
        <li>
            <DigisosLinkCard
                href={`${browserEnv.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad`}
                icon={<NotePencilIcon aria-hidden />}
            >
                {t("sokOmSosialhjelp")}
            </DigisosLinkCard>
        </li>
    );
};

export default SokButton;
