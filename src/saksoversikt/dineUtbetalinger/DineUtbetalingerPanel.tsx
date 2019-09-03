import React from "react";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import {Systemtittel, Normaltekst} from "nav-frontend-typografi";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import "./dineUtbetalingerPanel.less";

const DineUtbetalingerPanel: React.FC<{}> = () => {
    return (
        <LenkepanelBase href="#todod" className="panel-luft-over dine_utbetalinger_panel ">
            <div className="dine_utbetalinger_innhold">
                <HandCoinsIcon />
                <div>
                    <Systemtittel className="lenkepanel__heading">Dine utbetalinger</Systemtittel>
                    <Normaltekst>
                        Gå til oversikt over dine tidligere og kommende utbetalinger fra NAV.
                    </Normaltekst>
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default DineUtbetalingerPanel;
