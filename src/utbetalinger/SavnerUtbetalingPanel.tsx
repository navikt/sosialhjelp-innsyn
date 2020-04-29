import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import InfoIkon from "../components/ikoner/InfoIkon";

const SavnerUtbetalingPanel: React.FC = () => {
    return (
        <div className="savner_utbetaling_panel">
            <span className="infoIkon">
                <InfoIkon />
            </span>
            <Element>Savner du en utbetaling på denne siden?</Element>
            <br />
            <Normaltekst>Utbetalingsoversikten er under utvikling og vi kan for øyeblikket bare vise:</Normaltekst>
            <ul>
                <li>
                    <Normaltekst>
                        utbetalinger av økonomisk sosialhjelp,{" "}
                        <a className="lenke" href="https://tjenester.nav.no/utbetalingsoversikt">
                            andre utbetalinger finner du her
                        </a>
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>utbetalinger fra digitale søknader, men ikke fra papirsøknader</Normaltekst>
                </li>
                <li>
                    <Normaltekst>utbetalinger som er inntil ett år gamle</Normaltekst>
                </li>
            </ul>
        </div>
    );
};

export default SavnerUtbetalingPanel;
