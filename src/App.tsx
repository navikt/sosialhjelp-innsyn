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
import {isDevSbs, isProd} from "./utils/restUtils";
import Tilgangskontrollside from "./components/Tilgangskontrollside/Tilgangskontrollside";
import {initAmplitude} from "./utils/amplitude";
import {injectDecoratorClientSide} from "@navikt/nav-dekoratoren-moduler";

const store = configureStore();

const visSpraakNokler = (tekster: any) => {
    if (window.location.href.match(/\\?vistekster=true$/)) {
        Object.keys(tekster).map((key: string) => {
            return (tekster[key] = tekster[key] + "[" + key + "]");
        });
    }
    return tekster;
};

const origin = window.location.origin;
if (isProd(origin)) {
    Sentry.init({dsn: "https://400c64ba1df14250a6fa41eab8af5ca6@sentry.gc.nav.no/51"});
} else if (isDevSbs(origin)) {
    Sentry.init({dsn: "https://72e80fe5d64a4956a2861c3d7352e248@sentry.gc.nav.no/15"});
}
Sentry.setUser({ip_address: "", id: uuid()});

initAmplitude();

// Dersom appen bygges og deployes med docker-image vil dekoratøren bli lagt på serverside med express i Docker (eks ved deploy til miljø)
if (process.env.NODE_ENV !== "production") {
    injectDecoratorClientSide({
        env: "dev",
        simple: false,
        feedback: false,
        chatbot: false,
        shareScreen: false,
    });
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
