import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import BrodsmuleSti from "../components/brodsmuleSti/BrodsmuleSti";
import {Route, Switch} from "react-router";
import UtbetalingerDemo from "./statiskeDemoSider/UtbetalingerDemo";

const UtbetalingerRouter: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner/>
            <ConnectedRouter history={history}>
                <div className="utbetalinger-blokk-center">
                    <BrodsmuleSti/>
                    <Switch>
                        <Route exact path="/innsyn/utbetalinger/demo" component={UtbetalingerDemo}/>
                    </Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default UtbetalingerRouter;
