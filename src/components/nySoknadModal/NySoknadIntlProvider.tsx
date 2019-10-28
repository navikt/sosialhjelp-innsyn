import React from "react";
import {IntlProvider} from "react-intl";
import {kommunesokTekster} from "./kommunesokTekster";

const visSpraakNokler = (tekster: any) => {
    if (window.location.href.match(/\\?vistekster=true$/)){
        Object.keys(tekster).map((key: string) => {
            return tekster[key] = tekster[key] + "[" + key + "]";
        });
    }
    return tekster;
};

const NySoknadIntlProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const language = "nb";
    return (
        <IntlProvider defaultLocale={language} locale={language} messages={visSpraakNokler(kommunesokTekster[language])}>
            {children}
        </IntlProvider>
    );
};

export default NySoknadIntlProvider;
