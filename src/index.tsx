import "@navikt/ds-css";
import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import {injectDecoratorClientSide} from "@navikt/nav-dekoratoren-moduler";
import "./locales/i18n";

window.onerror = (errorMessage, url, line, column, error) => {
    // TODO implementere clientlogger, f.eks. slik:
    // store.dispatch(loggException(errorMessage.toString(), url, line, column, error));
    console.warn("TODO: Implementer clientlogger");
};

const init = async () => {
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
            language: "nb",
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
        });
    }

    const container = document.getElementById("maincontent");
    const root = createRoot(container!);
    root.render(<App />);
};

init();
