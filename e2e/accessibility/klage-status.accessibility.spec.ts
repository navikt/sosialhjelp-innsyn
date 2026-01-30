import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";
import { checkAccessibility } from "../helpers/accessibility-helpers";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Klage status page accessibility", () => {
    test("should not have any automatically detectable accessibility issues", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const mockKlageData = {
            digisosId: "test-id-1",
            klageId: "klage-1",
            vedtakId: "vedtak-1",
            klagePdf: {
                referanse: "klage-pdf-ref",
                datoLagtTil: "2025-12-01T10:00:00Z",
            },
            opplastedeVedlegg: [],
            ettersendelser: [],
            timestampSendt: 1733053200000,
        };

        await msw.mockEndpoint("/api/v1/innsyn/test-id-1/klage/klage-1", mockKlageData);

        await page.goto("/sosialhjelp/innsyn/nb/klage/status/test-id-1/klage-1");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });
});
