import React from "react";
import { Link } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { SoknadsStatusResponseStatus } from "../../generated/model";

const SoknadsStatusLenke = (props: { status: SoknadsStatusResponseStatus | undefined }) => {
    const { t } = useTranslation();
    switch (props.status) {
        case SoknadsStatusResponseStatus.SENDT:
        case SoknadsStatusResponseStatus.MOTTATT:
        case SoknadsStatusResponseStatus.UNDER_BEHANDLING:
            return (
                <Link href="https://www.nav.no/okonomisk-sosialhjelp#status-saksbehandlingstider">
                    {t("lenke.saksbehandling")}
                </Link>
            );

        case SoknadsStatusResponseStatus.FERDIGBEHANDLET:
            return <Link href="https://www.nav.no/okonomisk-sosialhjelp#klage">{t("lenke.klage")}</Link>;
    }
    return null;
};
export default SoknadsStatusLenke;
