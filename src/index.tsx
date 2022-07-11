import "core-js";
import "@navikt/ds-css";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "formdata-polyfill";
import Modal from "react-modal";

window.onerror = (errorMessage, url, line, column, error) => {
    // TODO implementere clientlogger, f.eks. slik:
    // store.dispatch(loggException(errorMessage.toString(), url, line, column, error));
    console.warn("TODO: Implementer clientlogger");
};

Modal.setAppElement("#root");

ReactDOM.render(<App />, document.getElementById("root"));
