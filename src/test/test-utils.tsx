import {render, RenderOptions} from "@testing-library/react";
import React, {ReactElement} from "react";
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "../rootReducer";
import {tekster} from "../tekster/tekster";

const store = createStore(rootReducer());

const Wrapper: React.FC = ({children}) => (
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
