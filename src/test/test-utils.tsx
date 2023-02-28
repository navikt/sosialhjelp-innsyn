import {render, RenderOptions} from "@testing-library/react";
import React, {ReactElement} from "react";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "../rootReducer";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import Feilside from "../components/feilside/Feilside";

const store = createStore(rootReducer());

interface Props {
    children: React.ReactNode;
}

export const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}}});
const Wrapper = ({children}: Props) => (
    <BrowserRouter>
        <Provider store={store}>
            <Feilside>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
