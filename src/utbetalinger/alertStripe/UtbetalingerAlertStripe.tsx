import React from "react";
import Alertstripe, {AlertStripeType} from "nav-frontend-alertstriper";
import "./utbetalingerAlertStripe.less";
import Lukknapp from "nav-frontend-lukknapp";
import {Normaltekst, Undertittel} from "nav-frontend-typografi";

/*  Wrapper rundt <Alertstripe> for å få høyrejustert lenker osv. Eksempe:

    <UtbetalingerAlertStripe
        type="advarsel"
        tittel="Du har fått et brev om saksbehandlingstiden for søknaden din."
    >
        <EksternLenke href={"123123"}>Vis brevet</EksternLenke>
    </UtbetalingerAlertStripe>
 */

interface Props {
    type: AlertStripeType;
    tittel: string;
    children: React.ReactNode | React.ReactChild | React.ReactChildren;
}

const UtbetalingerAlertStripe: React.FC<Props> = ({type, tittel, children}) => {

    return (
        <div className="utbetalingerAlertStripe">
            <Alertstripe type={type} >
                <Undertittel>{tittel}</Undertittel>
                <Normaltekst>{children}</Normaltekst>
            </Alertstripe>
            <div className="utbetalingerAlertStripe_lukknapp">
                <Lukknapp>Lukk</Lukknapp>
            </div>
        </div>
    );

};

export default UtbetalingerAlertStripe;
