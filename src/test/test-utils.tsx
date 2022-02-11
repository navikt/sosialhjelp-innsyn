import {render, RenderOptions} from "@testing-library/react";
import {createBrowserHistory} from "history";
import React from "react";
import {ReactElement} from "react";
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "../rootReducer";

const history = createBrowserHistory();

const store = createStore(rootReducer(history));

const Wrapper: React.FC = ({children}) => (
    <Provider store={store}>
        <IntlProvider locale="en">{children}</IntlProvider>
    </Provider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
    render(ui, {wrapper: Wrapper, ...options});

export * from "@testing-library/react";
export {customRender as render};
