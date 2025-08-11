import React from "react";
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import {
    DecoratorComponentsReact,
    DecoratorFetchProps,
    fetchDecoratorReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import { DecoratorLocale } from "@navikt/nav-dekoratoren-moduler";
import { Page } from "@navikt/ds-react";

import { getBreadcrumbs } from "../utils/breadcrumbs";

const decoratorParams = (ctx: DocumentContext): DecoratorFetchProps => ({
    env: createDecoratorEnv(),
    serviceDiscovery: true,
    params: {
        simple: false,
        feedback: false,
        chatbot: false,
        shareScreen: false,
        utilsBackground: "white",
        logoutUrl: process.env.NEXT_PUBLIC_DEKORATOREN_LOGOUT_URL || undefined,
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
        language: ctx.query.locale as DecoratorLocale,
        breadcrumbs: getBreadcrumbs(ctx.pathname),
        logoutWarning: false,
    },
});

function createDecoratorEnv(): "dev" | "prod" {
    switch (process.env.NEXT_PUBLIC_DEKORATOR_MILJO ?? "dev") {
        case "local":
        case "test":
        case "dev":
            return "dev";
        case "prod":
            return "prod";
        default:
            throw new Error(`Unknown runtime environment: ${process.env.DEKORATOR_MILJO}`);
    }
}

interface Props {
    Decorator: DecoratorComponentsReact;
    language?: string;
}

class MyDocument extends Document<Props> {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & Props> {
        const initialProps = await Document.getInitialProps(ctx);

        const language = ctx.query["locale"] as string | undefined;
        const props = decoratorParams(ctx);
        const Decorator = await fetchDecoratorReact(props);

        return { ...initialProps, Decorator, language };
    }

    render(): React.JSX.Element {
        const { Decorator, language } = this.props;
        return (
            <Html lang={language || "no"}>
                <Head>
                    <style>@layer base, dekorator-base, dekorator-utilities, theme, components, utilities;</style>
                    <Decorator.HeadAssets />
                    <link rel="icon" href="https://www.nav.no/favicon.ico" type="image/x-icon" />
                </Head>
                <body>
                    <Decorator.Header />
                    <Page footer={<Decorator.Footer />} className="bg-(--a-bg-subtle)">
                        <Main />
                    </Page>
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
