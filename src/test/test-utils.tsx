import {render, RenderOptions} from "@testing-library/react";
import React, {ReactElement} from "react";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "../rootReducer";
import {QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import Feilside from "../components/feilside/Feilside";
import {I18nextProvider} from "react-i18next";
import i18n from "../locales/i18n";

const store = createStore(rootReducer());

interface Props {
    children: React.ReactNode;
}

export const queryCache = new QueryCache();
export const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}}});
const Wrapper = ({children}: Props) => (
    <BrowserRouter>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <Feilside>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </Feilside>
            </I18nextProvider>
        </Provider>
    </BrowserRouter>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper"> & {route?: string}) => {
    window.history.pushState({}, "", options?.route);
    return render(ui, {wrapper: Wrapper, ...options});
};

export * from "@testing-library/react";
export {customRender as render};
