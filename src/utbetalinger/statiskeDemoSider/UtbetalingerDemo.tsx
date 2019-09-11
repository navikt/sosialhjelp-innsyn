import React from 'react';
import { Innholdstittel } from "nav-frontend-typografi";
import Periodevelger from "../Periodevelger";
import UtbetalingerAlertStripe from "../alertStripe/UtbetalingerAlertStripe";
import "../utbetalinger.less";
import MainNav from "../../components/main-nav/MainNav";
import UtbetalingerPanel from "./UtbetalingPanel";

const UtbetalingerDemo: React.FC = () => {

    return (
        <div className="utbetalinger">

            <div className="utbetalinger_row">
                <div className="utbetalinger_column">
                    <div className="utbetalinger_column_1"/>
                </div>

                <div className="utbetalinger_column">
                    <Innholdstittel>Utbetalingsoversikt</Innholdstittel>

                    <UtbetalingerAlertStripe
                        type="advarsel"
                        tittel="Noen av dine kommende utbetalinger har vilkår"
                    >
                        Du har oppgaver og aktiveter du må gjøre. Gå til
                        søknaden din og les vedtaksbrevet for detaljer.
                    </UtbetalingerAlertStripe>

                    <MainNav />
                </div>

            </div>

            <div className="utbetalinger_row">
                <div className="utbetalinger_column">
                    <div className="utbetalinger_column_1">
                        <Periodevelger className="utbetalinger_periodevelger_panel"/>
                    </div>
                </div>

                <UtbetalingerPanel />

            </div>

        </div>
    );

};

export default UtbetalingerDemo;
