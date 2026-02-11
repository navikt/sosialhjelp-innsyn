import { expect, test } from "@playwright/test";
import { addDays, subDays } from "date-fns";

import { createMswHelper, MswHelper } from "../helpers/msw-helpers";
import { checkAccessibility } from "../helpers/accessibility-helpers";
import { SaksDetaljerResponse, SaksDetaljerResponseStatus, SaksListeResponse } from "../../src/generated/model";
import { SakStatus } from "../../src/generated/ssr/model";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

const mockApplications = async (msw: MswHelper, n: number) => {
    const now = new Date();
    const soknadStatuser = Object.values(SaksDetaljerResponseStatus);
    const saksStatuser = Object.values(SakStatus);
    const saksListeResponses = Array.from(
        { length: n },
        (_, i) =>
            ({
                fiksDigisosId: `test-soknad-${i}`,
                soknadTittel: `Søknad ${i} om økonomisk sosialhjelp`,
                sistOppdatert: subDays(now, 3 * i).toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 100).toISOString(),
                isPapirSoknad: false,
            }) satisfies SaksListeResponse
    );
    await msw.mockEndpoint("/api/v1/innsyn/saker", saksListeResponses);
    const mocks = saksListeResponses.map((sak) => {
        const randomIndex = Math.floor(Math.random() * soknadStatuser.length);
        const randomStatus = soknadStatuser[randomIndex];
        return msw.mockEndpoint(`/api/v1/innsyn/sak/${sak.fiksDigisosId}/detaljer`, {
            fiksDigisosId: sak.fiksDigisosId,
            soknadTittel: sak.soknadTittel,
            status: randomStatus,
            antallNyeOppgaver: Math.floor(Math.random() * 5),
            dokumentasjonEtterspurt: Math.random() < 0.5,
            dokumentasjonkrav: Math.random() < 0.5,
            vilkar: Math.random() < 0.5,
            forelopigSvar: {
                harMottattForelopigSvar: Math.random() < 0.5,
            },
            saker: [
                {
                    status: saksStatuser[Math.floor(Math.random() * soknadStatuser.length)],
                    antallVedtak: Math.floor(Math.random() * 2),
                },
            ],
            sisteDokumentasjonKravFrist: addDays(now, 25).toISOString(),
        } satisfies SaksDetaljerResponse);
    });
    await Promise.all(mocks);
};

test.describe("Soknader page accessibility", () => {
    test("should not have any automatically detectable accessibility issues", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await mockApplications(msw, 30);

        await page.goto("/sosialhjelp/innsyn/nb/soknader");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });
        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);
        expect(results.violations).toEqual([]);
    });

    test("should not have accessibility issues with empty state", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        await msw.mockEndpoint("/api/v1/innsyn/saker", []);

        await page.goto("/sosialhjelp/innsyn/nb/soknader");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });
});
