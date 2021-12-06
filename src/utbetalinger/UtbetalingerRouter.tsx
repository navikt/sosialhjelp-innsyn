import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import {Switch} from "react-router";

const UtbetalingerRouter: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner />
            <ConnectedRouter history={history}>
                <div className="utbetalinger-blokk-center">
                    <Switch></Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default UtbetalingerRouter;
