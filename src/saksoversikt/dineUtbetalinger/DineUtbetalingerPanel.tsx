import React from "react";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import {Systemtittel, Normaltekst} from "nav-frontend-typografi";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import "./dineUtbetalingerPanel.less";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";

const DineUtbetalingerPanel: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const onClick = (event: any) => {
        dispatch(push("/innsyn/utbetaling"));
        event.preventDefault();
    };

    return (
        <LenkepanelBase
            href="/sosialhjelp/innsyn/utbetaling"
            onClick={(event: any) => onClick(event)}
            className="panel-luft-over dine_utbetalinger_panel "
        >
            <div className="dine_utbetalinger_innhold">
                <HandCoinsIcon />
                <div>
                    <Systemtittel className="lenkepanel__heading">Dine utbetalinger</Systemtittel>
                    <Normaltekst>Gå til oversikt over dine utførte utbetalinger fra NAV.</Normaltekst>
                </div>
            </div>
        </LenkepanelBase>
    );
};

export default DineUtbetalingerPanel;
