import React from "react";
import {Link} from "@navikt/ds-react";
import {SoknadsStatusResponseStatus} from "../../../generated/model";
import {useTranslation} from "next-i18next"

const SoknadsStatusLenke = (props: {status: SoknadsStatusResponseStatus | undefined}) => {
    const {t} = useTranslation();
    switch (props.status) {
        case SoknadsStatusResponseStatus.SENDT:
        case SoknadsStatusResponseStatus.MOTTATT:
        case SoknadsStatusResponseStatus.UNDER_BEHANDLING:
            return (
                <Link href="https://www.nav.no/okonomisk-sosialhjelp#saksbehandlingstider">
                    {t("lenke.saksbehandling")}
                </Link>
            );

        case SoknadsStatusResponseStatus.FERDIGBEHANDLET:
            return <Link href="https://www.nav.no/okonomisk-sosialhjelp#klage">{t("lenke.klage")}</Link>;
    }
    return null;
};
export default SoknadsStatusLenke;
