import React from "react";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import {Route, Switch} from "react-router";
import SaksoversiktTestMeny from "./SaksoversiktTestMeny";
import Saksoversikt from "./Saksoversikt";
import SaksoversiktBanner from "./banner/SaksoversiktBanner";
import * as Sentry from "@sentry/react";

const SentryRoute = Sentry.withSentryRouting(Route);

const SaksoversiktRouter: React.FC<{}> = () => {
    return (
        <div className="informasjon-side">
            <SaksoversiktBanner>Økonomisk sosialhjelp</SaksoversiktBanner>
            <div className="blokk-center">
                <ConnectedRouter history={history}>
                    <Switch>
                        <SentryRoute exact path="/" component={Saksoversikt} />
                        <SentryRoute exact path="/saksoversikt/" component={SaksoversiktTestMeny} />
                    </Switch>
                </ConnectedRouter>
            </div>
        </div>
    );
};

export default SaksoversiktRouter;
