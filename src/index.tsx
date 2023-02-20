import "core-js";
import "@navikt/ds-css";
import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import "formdata-polyfill";
import Modal from "react-modal";
import {injectDecoratorClientSide} from "@navikt/nav-dekoratoren-moduler";

window.onerror = (errorMessage, url, line, column, error) => {
    // TODO implementere clientlogger, f.eks. slik:
    // store.dispatch(loggException(errorMessage.toString(), url, line, column, error));
    console.warn("TODO: Implementer clientlogger");
};

Modal.setAppElement("#root");
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
        });
    }

    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(<App />);
};

init();
