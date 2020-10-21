import React from "react";
import {ConnectedRouter} from "connected-react-router";
import configureStore, {history} from "./configureStore";
import {Provider} from "react-redux";
import {Route, Switch} from "react-router";
import {IntlProvider} from "react-intl";
import * as Sentry from "@sentry/browser";
import {v4 as uuid} from "uuid";

import {tekster} from "./tekster/tekster";
import InnsynRouter from "./innsyn/InnsynRouter";
import "./App.less";
import SaksoversiktRouter from "./saksoversikt/SaksoversiktRouter";
import UtbetalingerRouter from "./utbetalinger/UtbetalingerRouter";
import Saksoversikt from "./saksoversikt/Saksoversikt";
import SideIkkeFunnet from "./components/sideIkkeFunnet/SideIkkeFunnet";
import Feilside from "./components/feilside/Feilside";
import {isDev, isQ} from "./utils/restUtils";
import Tilgangskontrollside from "./components/Tilgangskontrollside/Tilgangskontrollside";

const store = configureStore();

const visSpraakNokler = (tekster: any) => {
    if (window.location.href.match(/\\?vistekster=true$/)) {
        Object.keys(tekster).map((key: string) => {
            return (tekster[key] = tekster[key] + "[" + key + "]");
        });
    }
    return tekster;
};

if (isDev(window.location.origin) || isQ(window.location.origin)) {
    Sentry.init({
        dsn: "https://72e80fe5d64a4956a2861c3d7352e248@sentry.gc.nav.no/15",
    });
    Sentry.setUser({ip_address: "", id: uuid()});
}

const App: React.FC = () => {
    const language = "nb";
    return (
        <Provider store={store}>
            <IntlProvider defaultLocale={language} locale={language} messages={visSpraakNokler(tekster[language])}>
                <Feilside>
                    <Tilgangskontrollside>
                        <ConnectedRouter history={history}>
                            <Switch>
                                <Route exact path="/" component={Saksoversikt} />
                                <Route path="/saksoversikt" component={SaksoversiktRouter} />
                                <Route path="/innsyn/utbetalinger" component={UtbetalingerRouter} />
                                <Route exact path="/innsyn" component={Saksoversikt} />
                                <Route exact path="/innsyn/" component={Saksoversikt} />
                                <Route path="/innsyn/*" component={InnsynRouter} />
                                <Route component={SideIkkeFunnet} />
                            </Switch>
                        </ConnectedRouter>
                    </Tilgangskontrollside>
                </Feilside>
            </IntlProvider>
        </Provider>
    );
};

export default App;
