import { DownloadIcon, ExternalLinkIcon } from "@navikt/aksel-icons";
import React from "react";
import { useTranslations } from "next-intl";

interface HoyreIkonProps {
    ikon?: "download" | "externalLink";
}

const HoyreIkon = ({ ikon }: HoyreIkonProps) => {
    const t = useTranslations("HoyreIkon");
    switch (ikon) {
        case "download":
            return <DownloadIcon title={t("download")} fontSize="1.75rem" className="shrink-0" />;
        case "externalLink":
            return <ExternalLinkIcon title={t("externalLink")} fontSize="1.75rem" className="shrink-0" />;
        default:
            return null;
    }
};

export default HoyreIkon;
