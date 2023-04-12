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
    Outlet,
} from "react-router-dom";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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
import {useTranslation} from "react-i18next";
import UtbetalingerBeta from "./utbetalinger/beta/UtbetalingerBeta";
import Banner from "./components/banner/Banner";
const store = configureStore();

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

const MainLayout = () => (
    <>
        <AppBanner />
        <div className="blokk-center informasjon-side">
            <Outlet />
        </div>
    </>
);
const UtbetalingerBetaLayout = () => (
    <>
        <Banner>Utbetalinger</Banner>
        <Outlet />
    </>
);

const App = () => {
    const {i18n} = useTranslation();

    return (
        <Provider store={store}>
            <Feilside>
                <Tilgangskontrollside>
                    <BrowserRouter basename="/sosialhjelp/innsyn">
                        <QueryClientProvider client={queryClient}>
                            <ScrollToTop />
                            <div lang={i18n.language}>
                                <SentryRoutes>
                                    <Route path="/" element={<UtbetalingerBetaLayout />}>
                                        <Route path="/utbetalingerBeta" element={<UtbetalingerBeta />} />
                                    </Route>

                                    <Route path="/" element={<MainLayout />}>
                                        <Route index element={<Saksoversikt />} />
                                        <Route path="/utbetaling" element={<Utbetalinger />} />
                                        <Route path="/:soknadId/status" element={<SaksStatus />} />
                                        <Route path="/link" element={<Linkside />} />
                                        <Route path="*" element={<SideIkkeFunnet />} />
                                    </Route>
                                </SentryRoutes>
                            </div>
                        </QueryClientProvider>
                    </BrowserRouter>
                </Tilgangskontrollside>
            </Feilside>
        </Provider>
    );
};

export default App;
