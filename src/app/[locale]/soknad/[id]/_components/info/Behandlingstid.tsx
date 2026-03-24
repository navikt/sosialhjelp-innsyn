"use client";

import { BodyLong, BodyShort, Link } from "@navikt/ds-react";
import { Link as NextLink } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

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
                    <Link as={NextLink} inlineText href={"#forlenget-saksbehandlingstid"}>
                        {chunks}
                    </Link>
                ),
                navKontor: navKontor,
            })}
        </BodyLong>
    );
};

export default ForlengetBehandlingstid;
