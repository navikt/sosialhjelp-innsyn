import React, {useState} from "react";
import {AppProps} from "next/app";
import {QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useTranslation} from "next-i18next";
import {appWithTranslation} from "next-i18next";
import {logBrukerSpraakChange} from "../utils/amplitude";
import {useRouter} from "next/router";
import "../index.css";
import {onBreadcrumbClick, onLanguageSelect} from "@navikt/nav-dekoratoren-moduler";
import {configureLogger} from "@navikt/next-logger";
import Tilgangskontrollside from "../components/Tilgangskontrollside/Tilgangskontrollside";

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

const App = ({Component, pageProps}: AppProps): React.JSX.Element => {
    const {i18n} = useTranslation();
    const router = useRouter();
    const [queryHas403, setQueryHas403] = useState(false);
    onLanguageSelect(async (option) => {
        logBrukerSpraakChange(option.locale);
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
            <Tilgangskontrollside queryHas403={queryHas403}>
                <div lang={i18n.language}>
                    <Component {...pageProps}></Component>
                </div>
            </Tilgangskontrollside>
        </QueryClientProvider>
    );
};

export default appWithTranslation(App);
