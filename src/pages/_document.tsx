import React from "react";
import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from "next/document";
import {DecoratorComponents, DecoratorFetchProps, fetchDecoratorReact} from "@navikt/nav-dekoratoren-moduler/ssr";
import {DecoratorLocale} from "@navikt/nav-dekoratoren-moduler";
import {getBreadcrumbs} from "../hooks/useUpdateBreadcrumbs";
import {isDev, isLocalhost, isMock} from "../utils/restUtils";
import {logger} from "@navikt/next-logger";

// The 'head'-field of the document initialProps contains data from <head> (meta-tags etc)
const getDocumentParameter = (initialProps: DocumentInitialProps, name: string): string => {
    return initialProps.head?.find((element) => element?.props?.name === name)?.props?.content;
};

const decoratorParams = (ctx: DocumentContext): DecoratorFetchProps => ({
    env: createDecoratorEnv(ctx),
    serviceDiscovery: isDev() || isMock(),
    params: {
        simple: false,
        feedback: false,
        chatbot: false,
        shareScreen: false,
        utilsBackground: "white",
        logoutUrl: process.env.NEXT_PUBLIC_INNSYN_API_SINGLE_LOGOUT_URL || undefined,
        availableLanguages: [
            {
                locale: "nb",
                handleInApp: true,
            },
            {
                locale: "nn",
                handleInApp: true,
            },
            {
                locale: "en",
                handleInApp: true,
            },
        ],
        language: ctx.locale as DecoratorLocale,
        breadcrumbs: getBreadcrumbs(ctx.pathname),
    },
});

function createDecoratorEnv(ctx: DocumentContext): "dev" | "prod" {
    if (ctx.pathname === "/500" || ctx.pathname === "/404" || process.env.NODE_ENV === "development") {
        // Blir statisk kompilert i GHA så må hentes defra
        return "dev";
    }

    switch (process.env.NEXT_PUBLIC_DEKORATOR_MILJO) {
        case "local":
        case "test":
        case "dev":
            return "dev";
        case "demo":
        case "prod":
            return "prod";
        default:
            throw new Error(`Unknown runtime environment: ${process.env.DEKORATOR_MILJO}`);
    }
}

interface Props {
    Decorator: DecoratorComponents;
    language: string;
}

class MyDocument extends Document<Props> {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & Props> {
        logger.info("Henter initial props på _document");
        const initialProps = await Document.getInitialProps(ctx);

        const language = getDocumentParameter(initialProps, "lang");
        const props = decoratorParams(ctx);
        const Decorator = await fetchDecoratorReact(props);

        return {...initialProps, Decorator, language};
    }

    render(): React.JSX.Element {
        const {Decorator, language} = this.props;
        return (
            <Html lang={language || "no"}>
                <Head>
                    <Decorator.Styles />
                    <link
                        rel="preload"
                        href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
                </Head>
                <body>
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
