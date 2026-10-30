import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    redirect: vi.fn(() => {
        throw new Error("NEXT_REDIRECT");
    }),
    tilgjengelig: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("../../../_utils/isKlageTilgjengelig", () => ({ isKlageTilgjengelig: mocks.tilgjengelig }));
vi.mock("next-intl/server", () => ({ getTranslations: async () => (key: string) => key }));
vi.mock("@components/breadcrumbs/ClientBreadcrumbs", () => ({ default: () => null }));
vi.mock("./_components/KlageForm", () => ({ default: () => null }));
vi.mock("@generated/ssr/sak-controller/sak-controller", () => ({
    hentSakForVedtak: vi.fn().mockResolvedValue({}),
}));

import Page from "./page";

const params = Promise.resolve({ id: "soknad-1", vedtakId: "vedtak-1" });

describe("klage opprett page", () => {
    beforeEach(() => vi.clearAllMocks());

    it("redirects to the soknad when klage is not available", async () => {
        mocks.tilgjengelig.mockResolvedValue(false);
        await expect(Page({ params })).rejects.toThrow("NEXT_REDIRECT");
        expect(mocks.redirect).toHaveBeenCalledWith("/soknad/soknad-1");
    });

    it("renders when klage is available", async () => {
        mocks.tilgjengelig.mockResolvedValue(true);
        await Page({ params });
        expect(mocks.redirect).not.toHaveBeenCalled();
    });
});
