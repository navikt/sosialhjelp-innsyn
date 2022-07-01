import React from "react";
import {Link} from "@navikt/ds-react";
import {SoknadsStatusEnum} from "./soknadsStatusUtils";

const SoknadsStatusLenke = (props: {status: SoknadsStatusEnum | null}) => {
    switch (props.status) {
        case SoknadsStatusEnum.SENDT:
        case SoknadsStatusEnum.MOTTATT:
        case SoknadsStatusEnum.UNDER_BEHANDLING:
            return (
                <Link href="https://www.nav.no/sosialhjelp/behandlingstid">
                    Hvor lang tid tar det å behandle søknaden?
                </Link>
            );

        case SoknadsStatusEnum.FERDIGBEHANDLET:
            return <Link href="https://www.nav.no/sosialhjelp/klage">Hvordan sende klage?</Link>;
    }
    return null;
};
export default SoknadsStatusLenke;
