import React from "react";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import {Route, Switch} from "react-router";
import SaksoversiktTestMeny from "./SaksoversiktTestMeny";
import Saksoversikt from "./Saksoversikt";
import SaksoversiktBanner from "./banner/SaksoversiktBanner";

const SaksoversiktRouter: React.FC<{}> = () => {
    return (
        <div className="informasjon-side">
            <SaksoversiktBanner>Økonomisk sosialhjelp</SaksoversiktBanner>
            <div className="blokk-center">
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route exact path="/" component={Saksoversikt} />
                        <Route exact path="/saksoversikt/" component={SaksoversiktTestMeny} />
                    </Switch>
                </ConnectedRouter>
            </div>
        </div>
    )
};

export default SaksoversiktRouter;
