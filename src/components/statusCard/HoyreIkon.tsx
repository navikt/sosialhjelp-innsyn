import { DownloadIcon, ExpandIcon } from "@navikt/aksel-icons";
import React from "react";

interface HoyreIkonProps {
    ikon?: "download" | "expand";
}

const HoyreIkon = ({ ikon }: HoyreIkonProps) => {
    switch (ikon) {
        case "download":
            return <DownloadIcon fontSize="1.75rem" className="shrink-0" />;
        case "expand":
            return <ExpandIcon fontSize="1.75rem" className="shrink-0" />;
        default:
            return null;
    }
};

export default HoyreIkon;
