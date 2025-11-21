import { ArrowRightIcon, DownloadIcon, ExpandIcon } from "@navikt/aksel-icons";
import React from "react";

interface HoyreIkonProps {
    ikon?: "download" | "expand";
}

const HoyreIkon = ({ ikon }: HoyreIkonProps) => {
    switch (ikon) {
        case "download":
            return (
                <DownloadIcon
                    fontSize="1.75rem"
                    className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
            );
        case "expand":
            return (
                <ExpandIcon
                    fontSize="1.75rem"
                    className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
            );
        default:
            return (
                <ArrowRightIcon
                    fontSize="1.75rem"
                    className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
            );
    }
};

export default HoyreIkon;
