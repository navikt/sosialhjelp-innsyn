import { DownloadIcon, ExpandIcon } from "@navikt/aksel-icons";
import React from "react";
import { useTranslations } from "next-intl";

interface HoyreIkonProps {
    ikon?: "download" | "expand";
}

const HoyreIkon = ({ ikon }: HoyreIkonProps) => {
    const t = useTranslations("HoyreIkon");
    switch (ikon) {
        case "download":
            return <DownloadIcon title={t("download")} fontSize="1.75rem" className="shrink-0" />;
        case "expand":
            return <ExpandIcon title={t("expand")} fontSize="1.75rem" className="shrink-0" />;
        default:
            return null;
    }
};

export default HoyreIkon;
