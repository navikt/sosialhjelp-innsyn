import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import InfoIkon from "../components/ikoner/InfoIkon";

const SavnerUtbetalingPanel: React.FC = () => {

    return (
        <div className="savner_utbetaling_panel">
            <span className="infoIkon">
                <InfoIkon/>
            </span>
            <Element>Er det en utbetaling du savner?</Element>
            <br/>
            <Normaltekst>
                Utbetalingsoversikten er under utvikling, vi kan for øyeblikket derfor bare vise:
            </Normaltekst>
            <ul>
                <li>
                    <Normaltekst>
                        utbetalinger fra digitale søknader, men ikke fra papirsøknader
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        utbetalinger som er opp til ett år gamle, eldre enn dette blir slettet
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        utbetalinger fra sosialhjelpssøknader, andre utbetalinger finner du her
                    </Normaltekst>
                </li>
            </ul>
        </div>

    );
};

export default SavnerUtbetalingPanel;
