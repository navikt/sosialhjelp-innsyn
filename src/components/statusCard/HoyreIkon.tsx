import { DownloadIcon, ExpandIcon, ExternalLinkIcon } from "@navikt/aksel-icons";
import React from "react";
import { useTranslations } from "next-intl";

interface HoyreIkonProps {
    ikon?: "download" | "expand" | "external-link";
}

const HoyreIkon = ({ ikon }: HoyreIkonProps) => {
    const t = useTranslations("HoyreIkon");
    switch (ikon) {
        case "download":
            return <DownloadIcon title={t("download")} fontSize="1.75rem" className="shrink-0" />;
        case "expand":
            return <ExpandIcon title={t("expand")} fontSize="1.75rem" className="shrink-0" />;
        case "external-link":
            return <ExternalLinkIcon aria-hidden fontSize="1.75rem" className="shrink-0" />;
        default:
            return null;
    }
};

export default HoyreIkon;
