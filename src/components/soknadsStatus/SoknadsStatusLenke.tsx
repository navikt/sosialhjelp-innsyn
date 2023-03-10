import React from "react";
import {Link} from "@navikt/ds-react";
import {SoknadsStatusResponseStatus} from "../../generated/model";

const SoknadsStatusLenke = (props: {status: SoknadsStatusResponseStatus | undefined}) => {
    switch (props.status) {
        case SoknadsStatusResponseStatus.SENDT:
        case SoknadsStatusResponseStatus.MOTTATT:
        case SoknadsStatusResponseStatus.UNDER_BEHANDLING:
            return (
                <Link href="https://www.nav.no/okonomisk-sosialhjelp#saksbehandlingstider">
                    Hvor lang tid tar det å behandle søknaden?
                </Link>
            );

        case SoknadsStatusResponseStatus.FERDIGBEHANDLET:
            return <Link href="https://www.nav.no/okonomisk-sosialhjelp#klage">Hvordan sende klage?</Link>;
    }
    return null;
};
export default SoknadsStatusLenke;
