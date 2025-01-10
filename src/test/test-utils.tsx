import { render, renderHook, RenderHookOptions, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";

import { i18n } from "../setupTests";

interface Props {
    children: React.ReactNode;
}

export const queryCache = new QueryCache();
export const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const Wrapper = ({ children }: Props) => {
    return (
        <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </I18nextProvider>
    );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper"> & { route?: string }) => {
    window.history.pushState({}, "", options?.route);
    return render(ui, { wrapper: Wrapper, ...options });
};

const customRenderHook = <P, R>(hook: (initialProps: P) => R, options?: Omit<RenderHookOptions<P>, "wrapper">) => {
    return renderHook(hook, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
export { customRenderHook as renderHook };
