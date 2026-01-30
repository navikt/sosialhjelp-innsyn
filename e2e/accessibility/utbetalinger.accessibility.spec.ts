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

test.describe("Utbetalinger page accessibility", () => {
    test("should not have any automatically detectable accessibility issues", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

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
            {
                referanse: "utbetaling-2",
                tittel: "Boutgifter",
                belop: 8000,
                utbetalingsdato: "2025-12-10",
                status: "UTBETALT",
                fiksDigisosId: "test-id-1",
                annenMottaker: false,
            },
        ];

        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", mockUtbetalingerData);

        await page.goto("/sosialhjelp/innsyn/nb/utbetalinger");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });

    test("should not have accessibility issues with empty state", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", []);

        await page.goto("/sosialhjelp/innsyn/nb/utbetalinger");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });
});
