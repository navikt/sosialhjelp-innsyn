import { test, expect } from "@playwright/test";

import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Oppgaver", () => {
    test("should not show oppgaver when there are none", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        await mockSoknadEndpoints(msw, "test-soknad", {
            saksStatus: [
                {
                    status: "UNDER_BEHANDLING",
                    tittel: "Sak",
                    referanse: "9824",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [],
                },
            ],
            oppgaver: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });

        // Check that both vedtak are displayed
        const oppgaverHeading = page.getByRole("heading", { name: /oppgaver/i });

        await expect(oppgaverHeading).not.toBeVisible();
    });
});
