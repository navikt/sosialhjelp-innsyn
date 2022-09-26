import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import {Route, Switch} from "react-router";
import SaksStatus from "./SaksStatus";
import Linkside from "../components/linkside/Linkside";
import SideIkkeFunnet from "../components/sideIkkeFunnet/SideIkkeFunnet";
import Utbetalinger from "../utbetalinger/Utbetalinger";
import * as Sentry from "@sentry/react";

const SentryRoute = Sentry.withSentryRouting(Route);

const InnsynRouter: React.FC = () => {
    // Utbetalingssiden trenger bredere spaltebredde enn de andre sidene
    const ekstraSpaltebredde: boolean = window.location.pathname.match(/\/utbetaling/) !== null;

    return (
        <div id="maincontent" className="informasjon-side">
            <AppBanner />
            <ConnectedRouter history={history}>
                <div className={"blokk-center " + (ekstraSpaltebredde ? "blokk-center--wide" : "")}>
                    <Switch>
                        <SentryRoute exact path="/innsyn/utbetaling" component={Utbetalinger} />
                        <SentryRoute exact path="/innsyn/:soknadId/status" component={SaksStatus} />
                        <SentryRoute exact path="/innsyn/link" component={Linkside} />
                        <SentryRoute component={SideIkkeFunnet} />
                    </Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default InnsynRouter;
