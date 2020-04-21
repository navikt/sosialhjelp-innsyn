import "core-js";

import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import App from "./App";
import "formdata-polyfill";

window.onerror = (errorMessage, url, line, column, error) => {
    // TODO implementere clientlogger, f.eks. slik:
    // store.dispatch(loggException(errorMessage.toString(), url, line, column, error));
    console.warn("TODO: Implementer clientlogger");
};

ReactDOM.render(<App />, document.getElementById("root"));
