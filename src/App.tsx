import React from "react";
import configureStore from "./configureStore";
import {Provider} from "react-redux";
import {
    BrowserRouter,
    Route,
    Routes,
    useLocation,
    useNavigationType,
    createRoutesFromChildren,
    matchRoutes,
} from "react-router-dom";
import {IntlProvider} from "react-intl";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
import {tekster} from "./tekster/tekster";
import "./App.css";
import Saksoversikt from "./saksoversikt/Saksoversikt";
import SideIkkeFunnet from "./components/sideIkkeFunnet/SideIkkeFunnet";
import Feilside from "./components/feilside/Feilside";
import Tilgangskontrollside from "./components/Tilgangskontrollside/Tilgangskontrollside";
import {initAmplitude} from "./utils/amplitude";
import {injectDecoratorClientSide} from "@navikt/nav-dekoratoren-moduler";
import {isProd} from "./utils/restUtils";
import ScrollToTop from "./utils/ScrollToTop";
import AppBanner from "./components/appBanner/AppBanner";
import Utbetalinger from "./utbetalinger/Utbetalinger";
import SaksStatus from "./innsyn/SaksStatus";
import ReactDOM from "react-dom";
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
            new BrowserTracing({
                routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                    React.useEffect,
                    useLocation,
                    useNavigationType,
                    createRoutesFromChildren,
                    matchRoutes
                ),
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

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App = () => {
    const language = "nb";
    const ekstraSpaltebredde: boolean = window.location.pathname.match(/\/utbetaling/) !== null;

    return (
        <Provider store={store}>
            <IntlProvider defaultLocale={language} locale={language} messages={visSpraakNokler(tekster[language])}>
                <Feilside>
                    <Tilgangskontrollside>
                        <div id="maincontent" className="informasjon-side">
                            <AppBanner />
                            <BrowserRouter basename="/sosialhjelp/innsyn">
                                <ScrollToTop />

                                <div className={"blokk-center " + (ekstraSpaltebredde ? "blokk-center--wide" : "")}>
                                    <SentryRoutes>
                                        <Route path="/" element={<Saksoversikt />} />
                                        <Route path="/utbetaling" element={<Utbetalinger />} />
                                        <Route path="/:soknadId/status" element={SaksStatus} />
                                        <Route path="*" element={<SideIkkeFunnet />} />
                                    </SentryRoutes>
                                </div>
                            </BrowserRouter>
                        </div>
                    </Tilgangskontrollside>
                </Feilside>
            </IntlProvider>
        </Provider>
    );
};

export default App;
