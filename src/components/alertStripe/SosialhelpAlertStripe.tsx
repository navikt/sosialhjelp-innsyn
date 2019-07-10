import React from "react";
import Alertstripe, {AlertStripeType} from "nav-frontend-alertstriper";
import "./alertStripe.less";

/*  Wrapper rundt <Alertstripe> for å få høyrejustert lenker osv. Eksempe:

    <SosialhjelpAlertStripe
        type="advarsel"
        tittel="Du har fått et brev om saksbehandlingstiden for søknaden din."
    >
        <EksternLenke href={"123123"}>Vis brevet</EksternLenke>
    </SosialhjelpAlertStripe>
 */

interface Props {
    type: AlertStripeType;
    tittel: string;
    children: React.ReactNode | React.ReactChild | React.ReactChildren;
}

const SosialhjelpAlertStripe: React.FC<Props> = ({type, tittel, children}) => {

    return (
        <Alertstripe type={type} className="sosialhjelpAlertStripe">
            <span className="sosialhjelpAlertStripe_innhold">
                <span className="sosialhjelpAlertStripe_tittel">
                    {tittel}
                </span>
                <span className="sosialhjelpAlertStripe_barn">
                    {children}
                </span>
            </span>
        </Alertstripe>
    );

};

export default SosialhjelpAlertStripe;
