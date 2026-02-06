import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";
import { checkAccessibility } from "../helpers/accessibility-helpers";
import { SakResponse } from "../../src/generated/model";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Klage opprett page accessibility", () => {
    test("should not have any automatically detectable accessibility issues", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const mockSakData: SakResponse = {
            tittel: "Søknad om økonomisk sosialhjelp",
            utfallVedtak: "INNVILGET",
            navEnhetNavn: "NAV Oslo",
            vedtaksfilUrlList: [
                {
                    id: "rofl",
                    url: "/vedtak.pdf",
                    dato: "2025-11-20",
                },
            ],
        };
        await msw.mockEndpoint("/api/v1/innsyn/test-id-1/sak/vedtak-1", mockSakData);

        await page.goto("/sosialhjelp/innsyn/nb/klage/opprett/test-id-1/vedtak-1");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });
});
