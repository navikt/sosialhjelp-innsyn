import React from "react";
import InfoIkon from "../components/ikoner/InfoIkon";
import {BodyShort, Label, Link} from "@navikt/ds-react";

const SavnerUtbetalingPanel: React.FC = () => {
    return (
        <div className="savner_utbetaling_panel">
            <span className="infoIkon">
                <InfoIkon />
            </span>
            <Label spacing>Savner du en utbetaling på denne siden?</Label>
            <BodyShort>Utbetalingsoversikten er under utvikling og vi kan for øyeblikket bare vise:</BodyShort>
            <ul>
                <li>
                    <BodyShort>
                        utbetalinger av økonomisk sosialhjelp,{" "}
                        <Link href="https://tjenester.nav.no/utbetalingsoversikt">
                            andre utbetalinger finner du her
                        </Link>
                    </BodyShort>
                </li>
                <li>
                    <BodyShort>utbetalinger fra digitale søknader, men ikke fra papirsøknader</BodyShort>
                </li>
                <li>
                    <BodyShort>utbetalinger som er inntil ett år gamle</BodyShort>
                </li>
            </ul>
        </div>
    );
};

export default SavnerUtbetalingPanel;
