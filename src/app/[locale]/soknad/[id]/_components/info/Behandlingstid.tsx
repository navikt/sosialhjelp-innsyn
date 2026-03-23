"use client";

import { BodyLong, BodyShort, Link } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";

interface Props {
    navKontor: string;
    forelopigSvarUrl?: string;
}

const ForlengetBehandlingstid = ({ navKontor, forelopigSvarUrl }: Props) => {
    const t = useTranslations("ForlengetBehandlingstid");
    if (!forelopigSvarUrl) {
        return (
            <BodyLong>
                {t.rich("utenBrev", {
                    norsk: (chunks) => (
                        <BodyShort as="span" lang="no">
                            {chunks}
                        </BodyShort>
                    ),
                    navKontor: navKontor,
                })}
            </BodyLong>
        );
    }
    return (
        <BodyLong>
            {t.rich("medBrev", {
                norsk: (chunks) => (
                    <BodyShort as="span" lang="no">
                        {chunks}
                    </BodyShort>
                ),
                lenke: (chunks) => (
                    <Link inlineText href={forelopigSvarUrl} target="_blank" rel="noopener noreferrer">
                        {chunks}
                        <ExternalLinkIcon aria-hidden />
                    </Link>
                ),
                navKontor: navKontor,
            })}
        </BodyLong>
    );
};

export default ForlengetBehandlingstid;
