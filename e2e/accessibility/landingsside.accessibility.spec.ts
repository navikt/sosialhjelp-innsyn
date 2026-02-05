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

test.describe("Landing page accessibility", () => {
    test("should not have any automatically detectable accessibility issues", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        // Mock with empty data for simplicity
        await msw.mockEmptyState();

        await page.goto("/sosialhjelp/innsyn/nb");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });

    test("should not have accessibility issues with data present", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        // Mock with some data
        const mockSakerData = [
            {
                fiksDigisosId: "test-id-1",
                soknadTittel: "Søknad om økonomisk sosialhjelp",
                sistOppdatert: "2025-12-01T10:00:00Z",
                kommunenummer: "0301",
                soknadOpprettet: "2025-11-15T10:00:00Z",
                isPapirSoknad: false,
            },
        ];

        const mockUtbetalingerData = [
            {
                referanse: "utbetaling-1",
                tittel: "Livsopphold",
                belop: 15000,
                utbetalingsdato: "2025-12-15",
                status: "PLANLAGT_UTBETALING",
                fiksDigisosId: "test-id-1",
                annenMottaker: false,
            },
        ];

        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);
        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", mockUtbetalingerData);

        await page.goto("/sosialhjelp/innsyn/nb");

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });
});
