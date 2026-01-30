import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";

// Mock data for a søknad
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

// Mock data for an utbetaling
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

test.afterEach(async ({ request, baseURL }) => {
    // Reset MSW handlers after each test to avoid interference between tests
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    // Reset MSW handlers after each test to avoid interference between tests
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "whatever" });
});

test.describe("Snarveier on Landingsside", () => {
    test("should render snarveier", async ({ page, request, baseURL }) => {
        // Configure MSW to mock server-side API responses with data
        // This mocks both the Server Component fetches and client-side fetches
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);
        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", mockUtbetalingerData);

        await page.goto("/sosialhjelp/innsyn/nb");
        await expect(page.getByRole("heading", { name: "Snarveier" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Søknader" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Utbetalinger" })).toBeVisible();
    });

    test("should not render snarveier when no soknader, klager or utbetalinger", async ({ page, request, baseURL }) => {
        // Configure MSW to mock server-side API responses with empty arrays
        // This ensures no data is available for both server and client components
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEmptyState();

        await page.goto("/sosialhjelp/innsyn/nb");
        await expect(page.getByRole("heading", { name: "Snarveier" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Søknader" })).not.toBeVisible();
        await expect(page.getByRole("link", { name: "Utbetalinger" })).not.toBeVisible();
    });
});
