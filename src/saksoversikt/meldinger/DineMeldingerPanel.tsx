import React from "react";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import {Systemtittel, Normaltekst} from "nav-frontend-typografi";
import Dialog from "../../components/ikoner/Dialog";
import "./dineMeldinger.less";

const DineMeldingerPanel: React.FC = () => {
    return (
        <LenkepanelBase href="/sosialhjelp/meldinger" className="dineMeldinger__panel">
            <div className="dineMeldinger__innhold">
                <Dialog />
                <div>
                    <Systemtittel>Dine meldinger</Systemtittel>
                    <Normaltekst>Meldinger mellom deg og veilederen din</Normaltekst>
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default DineMeldingerPanel;
