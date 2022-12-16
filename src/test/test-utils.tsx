import {render, RenderOptions} from "@testing-library/react";
import {createBrowserHistory} from "history";
import React, {ReactElement} from "react";
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "../rootReducer";
import {tekster} from "../tekster/tekster";

const history = createBrowserHistory();

const store = createStore(rootReducer(history));

interface Props {
    children: React.ReactNode;
}

const Wrapper = ({children}: Props) => (
    <Provider store={store}>
        <IntlProvider defaultLocale="nb" locale="nb" messages={tekster["nb"]}>
            {children}
        </IntlProvider>
    </Provider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
    render(ui, {wrapper: Wrapper, ...options});

export * from "@testing-library/react";
export {customRender as render};
