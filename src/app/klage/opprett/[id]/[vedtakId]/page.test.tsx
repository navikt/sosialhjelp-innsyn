import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    class AuthenticatedFetchError extends Error {
        constructor(public readonly status: number) {
            super("fetch error");
        }
    }
    return {
        redirect: vi.fn(() => {
            throw new Error("NEXT_REDIRECT");
        }),
        tilgjengelig: vi.fn(),
        hentKlage: vi.fn(),
        AuthenticatedFetchError,
    };
});

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("../../../_utils/isKlageTilgjengelig", () => ({ isKlageTilgjengelig: mocks.tilgjengelig }));
vi.mock("next-intl/server", () => ({ getTranslations: async () => (key: string) => key }));
vi.mock("@components/breadcrumbs/ClientBreadcrumbs", () => ({ default: () => null }));
vi.mock("./_components/KlageForm", () => ({ default: () => null }));
vi.mock("@generated/ssr/sak-controller/sak-controller", () => ({
    hentSakForVedtak: vi.fn().mockResolvedValue({}),
}));
vi.mock("@generated/ssr", () => ({ hentKlageForVedtak: mocks.hentKlage }));
vi.mock("@api/ssr/authenticatedFetch", () => ({ AuthenticatedFetchError: mocks.AuthenticatedFetchError }));
vi.mock("@navikt/next-logger", () => ({ logger: { error: vi.fn() } }));

import Page from "./page";

const params = Promise.resolve({ id: "soknad-1", vedtakId: "vedtak-1" });

describe("klage opprett page", () => {
    beforeEach(() => vi.clearAllMocks());

    it("redirects to the soknad when klage is not available", async () => {
        mocks.tilgjengelig.mockResolvedValue(false);
        await expect(Page({ params })).rejects.toThrow("NEXT_REDIRECT");
        expect(mocks.redirect).toHaveBeenCalledWith("/soknad/soknad-1");
    });

    it("renders when klage is available and none exists", async () => {
        mocks.tilgjengelig.mockResolvedValue(true);
        mocks.hentKlage.mockRejectedValue(new mocks.AuthenticatedFetchError(404));
        await Page({ params });
        expect(mocks.redirect).not.toHaveBeenCalled();
    });

    it("redirects to the existing klage when one exists", async () => {
        mocks.tilgjengelig.mockResolvedValue(true);
        mocks.hentKlage.mockResolvedValue({ klageId: "klage-1" });
        await expect(Page({ params })).rejects.toThrow("NEXT_REDIRECT");
        expect(mocks.redirect).toHaveBeenCalledTimes(1);
        expect(mocks.redirect).toHaveBeenCalledWith("/klage/status/soknad-1/klage-1");
    });

    it("redirects to the soknad when fetching klage fails", async () => {
        mocks.tilgjengelig.mockResolvedValue(true);
        mocks.hentKlage.mockRejectedValue(new mocks.AuthenticatedFetchError(500));
        await expect(Page({ params })).rejects.toThrow("NEXT_REDIRECT");
        expect(mocks.redirect).toHaveBeenCalledWith("/soknad/soknad-1");
    });
});
