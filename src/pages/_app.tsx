import React, {useState} from "react";
import {AppProps} from "next/app";
import {QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {appWithTranslation, useTranslation} from "next-i18next";
import {logBrukerDefaultLanguage, logBrukerSpraakChange} from "../utils/amplitude";
import {useRouter} from "next/router";
import "../index.css";
import {onBreadcrumbClick, onLanguageSelect} from "@navikt/nav-dekoratoren-moduler";
import {configureLogger} from "@navikt/next-logger";
import Tilgangskontrollside from "../components/Tilgangskontrollside/Tilgangskontrollside";
import Cookies from "js-cookie";
import {FlagProvider} from "../featuretoggles/context";
import {IToggle} from "@unleash/nextjs";

const queryClient = (onError: QueryCache["config"]["onError"]) => {
    return new QueryClient({
        defaultOptions: {queries: {retry: false}},
        queryCache: new QueryCache({
            onError,
        }),
    });
};

configureLogger({
    basePath: "/sosialhjelp/innsyn",
});

// TODO: Dette er kanskje ikke den beste plassering
logBrukerDefaultLanguage(Cookies.get("decorator-language"));

const App = ({Component, pageProps}: AppProps<{toggles: IToggle[]}>): React.JSX.Element => {
    const {i18n} = useTranslation();
    const router = useRouter();
    const [queryHas403, setQueryHas403] = useState(false);
    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
        console.log("dont mind if i change");
        return router.replace(router.asPath, undefined, {locale: option.locale});
    });
    onBreadcrumbClick((breadcrumb) => router.push(breadcrumb.url));
    return (
        <QueryClientProvider
            client={queryClient((e: any) => {
                if (e?.response?.status === 403) {
                    setQueryHas403(true);
                }
            })}
        >
            <FlagProvider toggles={pageProps.toggles}>
                <Tilgangskontrollside queryHas403={queryHas403}>
                    <div role="main" tabIndex={-1} id="maincontent">
                        <Component {...pageProps}></Component>
                    </div>
                </Tilgangskontrollside>
            </FlagProvider>
        </QueryClientProvider>
    );
};

export default appWithTranslation(App);
