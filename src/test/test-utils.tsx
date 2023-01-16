import {render, RenderOptions} from "@testing-library/react";
import React, {ReactElement} from "react";
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "../rootReducer";
import {tekster} from "../tekster/tekster";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import Feilside from "../components/feilside/Feilside";

const store = createStore(rootReducer());

interface Props {
    children: React.ReactNode;
}

const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}}});
const Wrapper = ({children}: Props) => (
    <BrowserRouter>
        <Provider store={store}>
            <Feilside>
                <QueryClientProvider client={queryClient}>
                    <IntlProvider defaultLocale="nb" locale="nb" messages={tekster["nb"]}>
                        {children}
                    </IntlProvider>
                </QueryClientProvider>
            </Feilside>
        </Provider>
    </BrowserRouter>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper"> & {route?: string}) => {
    window.history.pushState({}, "", options?.route);
    return render(ui, {wrapper: Wrapper, ...options});
};

export * from "@testing-library/react";
export {customRender as render};
