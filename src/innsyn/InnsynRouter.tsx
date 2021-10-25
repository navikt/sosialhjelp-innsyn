import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import {Route, Switch} from "react-router";
import SaksStatus from "./SaksStatus";
import Linkside from "../components/linkside/Linkside";
import SideIkkeFunnet from "../components/sideIkkeFunnet/SideIkkeFunnet";
import Utbetalinger from "../utbetalinger/Utbetalinger";
import Sporreundersokelse from "./sporreundersokelse/Sporreundersokelse";

const InnsynRouter: React.FC = () => {
    // Utbetalingssiden trenger bredere spaltebredde enn de andre sidene
    const ekstraSpaltebredde: boolean = window.location.pathname.match(/\/utbetaling/) !== null;

    return (
        <div className="informasjon-side">
            <AppBanner />
            <ConnectedRouter history={history}>
                <div className={"blokk-center " + (ekstraSpaltebredde ? "blokk-center--wide" : "")}>
                    <Switch>
                        <Route exact path="/innsyn/utbetaling" component={Utbetalinger} />
                        <Route exact path="/innsyn/:soknadId/status" component={SaksStatus} />
                        <Route exact path="/innsyn/link" component={Linkside} />
                        <Route exact path="/innsyn/undersokelse" component={Sporreundersokelse} />
                        <Route component={SideIkkeFunnet} />
                    </Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default InnsynRouter;
