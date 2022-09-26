import React from "react";
import {ConnectedRouter} from "connected-react-router";
import configureStore, {history} from "./configureStore";
import {Provider} from "react-redux";
import {Route, Switch} from "react-router";
import {IntlProvider} from "react-intl";
import * as Sentry from "@sentry/react";

import {tekster} from "./tekster/tekster";
import InnsynRouter from "./innsyn/InnsynRouter";
import "./App.css";
import SaksoversiktRouter from "./saksoversikt/SaksoversiktRouter";
import Saksoversikt from "./saksoversikt/Saksoversikt";
import SideIkkeFunnet from "./components/sideIkkeFunnet/SideIkkeFunnet";
import Feilside from "./components/feilside/Feilside";
import Tilgangskontrollside from "./components/Tilgangskontrollside/Tilgangskontrollside";
import {initAmplitude} from "./utils/amplitude";
import {injectDecoratorClientSide} from "@navikt/nav-dekoratoren-moduler";
import {Integrations} from "@sentry/tracing";
import {isProd} from "./utils/restUtils";
import ScrollToTop from "./utils/ScrollToTop";

const store = configureStore();

const visSpraakNokler = (tekster: any) => {
    if (window.location.href.match(/\\?vistekster=true$/)) {
        Object.keys(tekster).map((key: string) => {
            return (tekster[key] = tekster[key] + "[" + key + "]");
        });
    }
    return tekster;
};

if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: "https://be38195df549433ea37648dfbc4e074e@sentry.gc.nav.no/103",
        integrations: [
            new Integrations.BrowserTracing({
                routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
            }),
        ],

        environment: isProd(window.location.origin) ? "prod-sbs" : "development",
        tracesSampleRate: 1.0,
    });
}

initAmplitude();

/* Dersom appen bygges og deployes med docker-image vil dekoratøren bli lagt på serverside med express i Docker
 (eks ved deploy til miljø). Når den injectes clientside legges den utenfor body, slik at stylingen som
 gir sticky footer gir en unødvendig scrollbar localhost på sider med lite innhold
*/
if (process.env.NODE_ENV !== "production") {
    injectDecoratorClientSide({
        env: "dev",
        simple: false,
        feedback: false,
        chatbot: false,
        shareScreen: false,
        utilsBackground: "white",
    });
}

const SentryRoute = Sentry.withSentryRouting(Route);

const App: React.FC = () => {
    const language = "nb";
    return (
        <Provider store={store}>
            <IntlProvider defaultLocale={language} locale={language} messages={visSpraakNokler(tekster[language])}>
                <Feilside>
                    <Tilgangskontrollside>
                        <ConnectedRouter history={history}>
                            <ScrollToTop />
                            <Switch>
                                <SentryRoute exact path="/" component={Saksoversikt} />
                                <SentryRoute path="/saksoversikt" component={SaksoversiktRouter} />
                                <SentryRoute exact path="/innsyn" component={Saksoversikt} />
                                <SentryRoute exact path="/innsyn/" component={Saksoversikt} />
                                <SentryRoute path="/innsyn/*" component={InnsynRouter} />
                                <SentryRoute component={SideIkkeFunnet} />
                            </Switch>
                        </ConnectedRouter>
                    </Tilgangskontrollside>
                </Feilside>
            </IntlProvider>
        </Provider>
    );
};

export default App;
