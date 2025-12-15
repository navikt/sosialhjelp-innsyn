import { test, expect } from "@playwright/test";
import { subDays } from "date-fns";

import { createMswHelper } from "../helpers/msw-helpers";
import { SaksDetaljerResponse } from "../../src/generated/model";

test.afterEach(async ({ request, baseURL }) => {
    // Reset MSW handlers after each test to avoid interference between tests
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Soknader page - application categorization", () => {
    test("applications older than 21 days with status FERDIGBEHANDLET should move to Earlier applications", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const now = new Date();
        const recentDate = subDays(now, 5); // 5 days old - should be in "Active"
        const oldDate = subDays(now, 30); // 30 days old - should be in "Earlier"

        // Mock saker list endpoint
        const mockSakerData = [
            {
                fiksDigisosId: "recent-soknad-1",
                soknadTittel: "Recent Application",
                sistOppdatert: recentDate.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 10).toISOString(),
                isPapirSoknad: false,
            },
            {
                fiksDigisosId: "old-soknad-1",
                soknadTittel: "Old Application",
                sistOppdatert: oldDate.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 40).toISOString(),
                isPapirSoknad: false,
            },
        ];

        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);

        // Mock saksdetaljer for recent application (UNDER_BEHANDLING - should be active)
        await msw.mockEndpoint("/api/v1/innsyn/sak/recent-soknad-1/detaljer", {
            fiksDigisosId: "recent-soknad-1",
            soknadTittel: "Recent Application",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: {
                harMottattForelopigSvar: false,
            },
            saker: [],
        } satisfies SaksDetaljerResponse);

        // Mock saksdetaljer for old application (FERDIGBEHANDLET - should be in earlier)
        await msw.mockEndpoint("/api/v1/innsyn/sak/old-soknad-1/detaljer", {
            fiksDigisosId: "old-soknad-1",
            soknadTittel: "Old Application",
            status: "FERDIGBEHANDLET",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: {
                harMottattForelopigSvar: false,
            },
            saker: [],
        } satisfies SaksDetaljerResponse);

        // Navigate to the soknader page
        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();
        // Wait for the page to load
        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        // Check that "Aktive søknader" section exists and contains the recent application
        const activeSoknaderHeading = page.getByRole("heading", { name: "Aktive søknader", level: 2 });
        await expect(activeSoknaderHeading).toBeVisible();

        // The recent application should be visible in the active section
        await expect(page.getByText("Recent Application")).toBeVisible();

        // Check that "Tidligere søknader" section exists
        const tidligereSoknaderHeading = page.getByRole("heading", { name: "Tidligere søknader", level: 2 });
        await expect(tidligereSoknaderHeading).toBeVisible();

        // The old application should be visible in the earlier section
        await expect(page.getByText("Old Application")).toBeVisible();
    });

    test("FERDIGBEHANDLET applications newer than 21 days should stay in Active applications", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const now = new Date();
        const recentDate = subDays(now, 10); // 10 days old - should still be in "Active"

        // Mock saker list endpoint
        const mockSakerData = [
            {
                fiksDigisosId: "recent-ferdig-1",
                soknadTittel: "Recent Finished Application",
                sistOppdatert: recentDate.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 15).toISOString(),
                isPapirSoknad: false,
            },
        ];

        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);

        // Mock saksdetaljer for recent finished application
        await msw.mockEndpoint("/api/v1/innsyn/sak/recent-ferdig-1/detaljer", {
            fiksDigisosId: "recent-ferdig-1",
            soknadTittel: "Recent Finished Application",
            status: "FERDIGBEHANDLET",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: {
                harMottattForelopigSvar: false,
            },
            saker: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();
        // Wait for the page to load
        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        // Check that "Aktive søknader" section exists
        await expect(page.getByRole("heading", { name: "Aktive søknader", level: 2 })).toBeVisible();

        // The recent finished application should be in active section
        await expect(page.getByText("Recent Finished Application")).toBeVisible();

        // "Tidligere søknader" section should not exist since we have no old applications
        await expect(page.getByRole("heading", { name: "Tidligere søknader", level: 2 })).not.toBeVisible();
    });

    test("should show only Earlier applications when all applications are old and finished", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const now = new Date();
        const oldDate1 = subDays(now, 30);
        const oldDate2 = subDays(now, 45);

        // Mock saker list endpoint with only old applications
        const mockSakerData = [
            {
                fiksDigisosId: "old-soknad-1",
                soknadTittel: "Old Application 1",
                sistOppdatert: oldDate1.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 40).toISOString(),
                isPapirSoknad: false,
            },
            {
                fiksDigisosId: "old-soknad-2",
                soknadTittel: "Old Application 2",
                sistOppdatert: oldDate2.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 50).toISOString(),
                isPapirSoknad: false,
            },
        ];

        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);

        // Mock saksdetaljer for both old applications
        await msw.mockEndpoint("/api/v1/innsyn/sak/old-soknad-1/detaljer", {
            fiksDigisosId: "old-soknad-1",
            soknadTittel: "Old Application 1",
            status: "FERDIGBEHANDLET",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: {
                harMottattForelopigSvar: false,
            },
            saker: [],
        });

        await msw.mockEndpoint("/api/v1/innsyn/sak/old-soknad-2/detaljer", {
            fiksDigisosId: "old-soknad-2",
            soknadTittel: "Old Application 2",
            status: "FERDIGBEHANDLET",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: {
                harMottattForelopigSvar: false,
            },
            saker: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        // Wait for the page to load
        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        // "Aktive søknader" section should show empty state or not contain old applications
        const emptyStateHeading = page.getByRole("heading", { name: "Vi finner ingen søknader fra deg" });
        await expect(emptyStateHeading).toBeVisible();

        // "Tidligere søknader" section should exist and contain both applications
        await expect(page.getByRole("heading", { name: "Tidligere søknader", level: 2 })).toBeVisible();
        await expect(page.getByText("Old Application 1")).toBeVisible();
        await expect(page.getByText("Old Application 2")).toBeVisible();
    });

    test("applications with status other than FERDIGBEHANDLET should always be in Active applications", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const now = new Date();
        const oldDate = subDays(now, 40); // Even though it's old, non-FERDIGBEHANDLET should be active

        // Mock saker list endpoint
        const mockSakerData = [
            {
                fiksDigisosId: "old-active-1",
                soknadTittel: "Old But Still Active Application",
                sistOppdatert: oldDate.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 50).toISOString(),
                isPapirSoknad: false,
            },
        ];

        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);

        // Mock saksdetaljer with UNDER_BEHANDLING status
        await msw.mockEndpoint("/api/v1/innsyn/sak/old-active-1/detaljer", {
            fiksDigisosId: "old-active-1",
            soknadTittel: "Old But Still Active Application",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: {
                harMottattForelopigSvar: false,
            },
            saker: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        // Wait for the page to load
        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        // Check that "Aktive søknader" section exists and contains the application
        await expect(page.getByRole("heading", { name: "Aktive søknader", level: 2 })).toBeVisible();
        await expect(page.getByText("Old But Still Active Application")).toBeVisible();

        // "Tidligere søknader" section should not exist
        await expect(page.getByRole("heading", { name: "Tidligere søknader", level: 2 })).not.toBeVisible();
    });
});
