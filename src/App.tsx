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
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {tekster} from "./tekster/tekster";
import "./App.css";
import Saksoversikt from "./saksoversikt/Saksoversikt";
import SideIkkeFunnet from "./components/sideIkkeFunnet/SideIkkeFunnet";
import Feilside from "./components/feilside/Feilside";
import Tilgangskontrollside from "./components/Tilgangskontrollside/Tilgangskontrollside";
import {initAmplitude} from "./utils/amplitude";
import {isProd} from "./utils/restUtils";
import ScrollToTop from "./utils/ScrollToTop";

import AppBanner from "./components/appBanner/AppBanner";
import Utbetalinger from "./utbetalinger/Utbetalinger";
import SaksStatus from "./innsyn/SaksStatus";
import Linkside from "./components/linkside/Linkside";
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

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const queryClient = new QueryClient();

const App = () => {
    const language = "nb";

    return (
        <Provider store={store}>
            <IntlProvider defaultLocale={language} locale={language} messages={visSpraakNokler(tekster[language])}>
                <Feilside>
                    <Tilgangskontrollside>
                        <BrowserRouter basename="/sosialhjelp/innsyn">
                            <QueryClientProvider client={queryClient}>
                                <ScrollToTop />
                                <main id="maincontent" tabIndex={-1}>
                                    <AppBanner />
                                    <div className="blokk-center informasjon-side">
                                        <SentryRoutes>
                                            <Route path="/" element={<Saksoversikt />} />
                                            <Route path="/utbetaling" element={<Utbetalinger />} />
                                            <Route path="/:soknadId/status" element={<SaksStatus />} />
                                            <Route path="/link" element={<Linkside />} />
                                            <Route path="*" element={<SideIkkeFunnet />} />
                                        </SentryRoutes>
                                    </div>
                                </main>
                            </QueryClientProvider>
                        </BrowserRouter>
                    </Tilgangskontrollside>
                </Feilside>
            </IntlProvider>
        </Provider>
    );
};

export default App;
