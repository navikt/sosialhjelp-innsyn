import { test, expect } from "@playwright/test";
import { addDays, subDays } from "date-fns";

import { createMswHelper } from "../helpers/msw-helpers";
import { SaksDetaljerResponse, SaksListeResponse } from "../../src/generated/model";

test.afterEach(async ({ request, baseURL }) => {
    // Reset MSW handlers after each test to avoid interference between tests
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
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

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();
        // Wait for the page to load
        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        const activeSoknaderHeading = page.getByRole("heading", { name: "Aktive saker", level: 2 });
        await expect(activeSoknaderHeading).toBeVisible();

        await expect(page.getByText("Recent Application")).toBeVisible();

        const tidligereSoknaderHeading = page.getByRole("heading", { name: "Tidligere saker", level: 2 });
        await expect(tidligereSoknaderHeading).toBeVisible();

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
        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        await expect(page.getByRole("heading", { name: "Aktive saker", level: 2 })).toBeVisible();

        await expect(page.getByText("Recent Finished Application")).toBeVisible();

        await expect(page.getByRole("heading", { name: "Tidligere saker", level: 2 })).not.toBeVisible();
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

        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        const emptyStateHeading = page.getByRole("heading", { name: "Vi finner ingen søknader fra deg" });
        await expect(emptyStateHeading).toBeVisible();

        await expect(page.getByRole("heading", { name: "Tidligere saker", level: 2 })).toBeVisible();
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

        await expect(page.getByRole("heading", { name: "Søknader", level: 1 })).toBeVisible();

        await expect(page.getByRole("heading", { name: "Aktive saker", level: 2 })).toBeVisible();
        await expect(page.getByText("Old But Still Active Application")).toBeVisible();

        await expect(page.getByRole("heading", { name: "Tidligere saker", level: 2 })).not.toBeVisible();
    });
});

test.describe("SoknadCard rendering logic", () => {
    test.beforeEach(async ({ request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test" });
        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", []);
    });

    test("MOTTATT status with sendtDato should show DatoTag and BehandlingsStatusTag", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-mottatt-1",
            soknadTittel: "Søknad mottatt",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-15T10:00:00Z",
            status: "MOTTATT",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {});

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad mottatt/ })).toBeVisible();
        await expect(page.getByText(/Sendt/).first()).toBeVisible();
        await expect(page.getByText(/Mottatt/).last()).toBeVisible();
    });

    test("MOTTATT status with oppgaver should show AlertTag for oppgave", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-mottatt-oppgave",
            soknadTittel: "Søknad med oppgave",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-15T10:00:00Z",
            status: "MOTTATT",
            antallNyeOppgaver: 2,
            forsteOppgaveFrist: "2025-12-20T10:00:00Z",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            antallNyeOppgaver: 2,
            forsteOppgaveFrist: "2025-12-20T10:00:00Z",
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        // Should show the søknad card
        await expect(page.getByRole("link", { name: /Søknad med oppgave/ })).toBeVisible();
        // Should show "Sendt" tag
        await expect(page.getByText(/Sendt/).first()).toBeVisible();
        // Should show "Mottatt" behandlingsstatus tag
        await expect(page.getByText(/Mottatt/).last()).toBeVisible();
        // Should show oppgave alert tag with deadline
        await expect(page.getByText(/20\.12\.2025/)).toBeVisible();
    });

    test("MOTTATT status for paper sent application should show mottatt date tag", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-mottatt-oppgave",
            soknadTittel: "Papirsøknad",
            kommunenummer: "0301",
            mottattTidspunkt: "2025-11-15T10:00:00Z",
            status: "MOTTATT",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {});

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        // Should show the søknad card
        await expect(page.getByRole("link", { name: /Papirsøknad/ })).toBeVisible();
        // Should show the date tag with mottatt text
        await expect(page.getByText("Mottatt 15.11.2025")).toBeVisible();
    });

    test("SENDT status should show DatoTag without BehandlingsStatusTag", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-sendt-1",
            soknadTittel: "Søknad sendt",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-20T10:00:00Z",
            status: "SENDT",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {});

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad sendt/ })).toBeVisible();
        // Should show "Sendt" tag
        await expect(page.getByText(/Sendt/).first()).toBeVisible();
    });

    test("UNDER_BEHANDLING status should show BehandlingsStatusTag", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-under-behandling-1",
            soknadTittel: "Søknad under behandling",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-10T10:00:00Z",
            mottattTidspunkt: "2025-11-11T10:00:00Z",
            status: "UNDER_BEHANDLING",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            saker: [{ status: "UNDER_BEHANDLING", antallVedtak: 0 }],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad under behandling/ })).toBeVisible();
        // Should show "Sendt" date tag
        await expect(page.getByText(/Sendt/).first()).toBeVisible();
        // Should show "Under behandling" status tag
        await expect(page.getByText(/Under behandling/)).toBeVisible();
    });

    test("UNDER_BEHANDLING with multiple saker should show vedtak progress", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-under-behandling-progress",
            soknadTittel: "Søknad med flere saker",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-05T10:00:00Z",
            status: "UNDER_BEHANDLING",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            fiksDigisosId: mockSak.fiksDigisosId,
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            forelopigSvar: { harMottattForelopigSvar: false },
            dokumentasjonkrav: false,
            status: "UNDER_BEHANDLING",
            soknadTittel: "Søknad med flere saker",
            vilkar: false,
            saker: [
                { status: "FERDIGBEHANDLET", antallVedtak: 1 },
                { status: "FERDIGBEHANDLET", antallVedtak: 1 },
                { status: "UNDER_BEHANDLING", antallVedtak: 0 },
            ],
        } satisfies SaksDetaljerResponse);

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad med flere saker/ })).toBeVisible();
        await expect(page.getByText(/2 av 3 saker er ferdigbehandlet/)).toBeVisible();
    });

    test("UNDER_BEHANDLING with multiple vedtak should show VedtakTag", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-ferdigbehandlet-vedtak",
            soknadTittel: "Søknad med flere vedtak",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-01T10:00:00Z",
            status: "FERDIGBEHANDLET",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            fiksDigisosId: "test-ferdigbehandlet-vedtak",
            saker: [{ status: "FERDIGBEHANDLET", antallVedtak: 2 }],
            status: "FERDIGBEHANDLET",
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad med flere vedtak/ })).toBeVisible();
        await expect(page.getByText(/Nytt vedtak/)).toBeVisible();
    });

    test("UNDER_BEHANDLING with forelopigSvar should show forlenget behandlingstid alert", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-under-behandling-forelopig",
            soknadTittel: "Søknad med forlenget behandlingstid",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-10-01T10:00:00Z",
            isPapirSoknad: false,
        } satisfies SaksListeResponse;
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            status: "UNDER_BEHANDLING",
            fiksDigisosId: "test-under-behandling-forelopig",
            forelopigSvar: { harMottattForelopigSvar: true, link: "link.no" },
            saker: [{ status: "UNDER_BEHANDLING", antallVedtak: 0 }],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad med forlenget behandlingstid/ })).toBeVisible();
        await expect(page.getByText(/Forlenget saksbehandlingstid/)).toBeVisible();
    });

    test("FERDIGBEHANDLET status newer than 21 days should show ferdigbehandlet_nylig", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const recentDate = subDays(new Date(), 10); // 10 days ago
        const mockSak = {
            fiksDigisosId: "test-ferdigbehandlet-nylig",
            soknadTittel: "Søknad ferdigbehandlet nylig",
            sistOppdatert: recentDate.toISOString(),
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-01T10:00:00Z",
            status: "FERDIGBEHANDLET",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            saker: [{ status: "FERDIGBEHANDLET", antallVedtak: 1 }],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad ferdigbehandlet nylig/ })).toBeVisible();
        // Should show "Ferdigbehandlet" status tag
        await expect(page.getByText(/Ferdigbehandlet/)).toBeVisible();
    });

    test("FERDIGBEHANDLET status older than 21 days should show ferdigbehandlet_eldre", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const oldDate = subDays(new Date(), 30); // 30 days ago
        const mockSak = {
            fiksDigisosId: "test-ferdigbehandlet-eldre",
            soknadTittel: "Søknad ferdigbehandlet for lenge siden",
            sistOppdatert: oldDate.toISOString(),
            kommunenummer: "0301",
            soknadOpprettet: "2025-10-01T10:00:00Z",
            status: "FERDIGBEHANDLET",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            fiksDigisosId: "test-ferdigbehandlet-eldre",
            saker: [{ status: "FERDIGBEHANDLET", antallVedtak: 1 }],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad ferdigbehandlet for lenge siden/ })).toBeVisible();
        // Should show "Ferdigbehandlet" status tag
        await expect(page.getByText(/Ferdigbehandlet/)).toBeVisible();
    });

    test("FERDIGBEHANDLET with vilkar should show oppgave AlertTag", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-ferdigbehandlet-vilkar",
            soknadTittel: "Søknad ferdigbehandlet med vilkår",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-11-01T10:00:00Z",
            status: "FERDIGBEHANDLET",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            vilkar: true,
            forsteOppgaveFrist: "2025-12-25T10:00:00Z",
            fiksDigisosId: "test-ferdigbehandlet-vilkar",
            antallNyeOppgaver: 1,
            saker: [{ status: "FERDIGBEHANDLET", antallVedtak: 1 }],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Søknad ferdigbehandlet med vilkår/ })).toBeVisible();
        // Should show oppgave alert with deadline
        await expect(page.getByText(/25\.12\.2025/)).toBeVisible();
    });

    test("Complex scenario: UNDER_BEHANDLING with all possible tags", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const mockSak = {
            fiksDigisosId: "test-complex",
            soknadTittel: "Kompleks søknad",
            sistOppdatert: "2025-12-01T10:00:00Z",
            kommunenummer: "0301",
            soknadOpprettet: "2025-10-01T10:00:00Z",
            mottattTidspunkt: "2025-10-02T10:00:00Z",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 1,
            forsteOppgaveFrist: "2025-12-18T10:00:00Z",
        };
        await msw.mockEndpoint("/api/v1/innsyn/saker", [mockSak]);
        await msw.mockEndpoint(`/api/v1/innsyn/sak/${mockSak.fiksDigisosId}/detaljer`, {
            antallNyeOppgaver: 1,
            fiksDigisosId: "test-complex",
            forsteOppgaveFrist: "2025-12-18T10:00:00Z",
            forelopigSvar: { harMottattForelopigSvar: true },
            saker: [
                { status: "FERDIGBEHANDLET", antallVedtak: 2 },
                { status: "UNDER_BEHANDLING", antallVedtak: 0 },
            ],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("link", { name: /Kompleks søknad/ })).toBeVisible();
        // Should show date tag
        await expect(page.getByText(/Sendt/).first()).toBeVisible();
        // Should show vedtak progress
        await expect(page.getByText(/1 av 2 saker er ferdigbehandlet/)).toBeVisible();
        await expect(page.getByText(/Nytt vedtak/)).toBeVisible();
        await expect(page.getByText(/18\.12\.2025/)).toBeVisible();
        // Should show forlenget behandlingstid
        await expect(page.getByText(/Forlenget saksbehandlingstid/)).toBeVisible();
    });
});

test.describe("Sorting", () => {
    test("should sort by: 1) deadline (earliest first), 2) tasks without deadline, 3) no tasks (by sistOppdatert)", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const now = new Date();
        const tomorrow = addDays(now, 1);
        const nextWeek = addDays(now, 7);

        const mockSakerData: SaksListeResponse[] = [
            {
                fiksDigisosId: "soknad-no-tasks-oldest",
                soknadTittel: "No tasks oldest",
                sistOppdatert: subDays(now, 10).toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 15).toISOString(),
                isPapirSoknad: false,
            },
            {
                fiksDigisosId: "soknad-deadline-later",
                soknadTittel: "Deadline next week",
                sistOppdatert: now.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 5).toISOString(),
                isPapirSoknad: false,
            },
            {
                fiksDigisosId: "soknad-tasks-no-deadline",
                soknadTittel: "Tasks without deadline",
                sistOppdatert: now.toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 3).toISOString(),
                isPapirSoknad: false,
            },
            {
                fiksDigisosId: "soknad-deadline-soon",
                soknadTittel: "Deadline tomorrow",
                sistOppdatert: subDays(now, 2).toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 10).toISOString(),
                isPapirSoknad: false,
            },
            {
                fiksDigisosId: "soknad-no-tasks-newest",
                soknadTittel: "No tasks newest",
                sistOppdatert: subDays(now, 1).toISOString(),
                kommunenummer: "0301",
                soknadOpprettet: subDays(now, 2).toISOString(),
                isPapirSoknad: false,
            },
        ];

        await msw.mockEndpoint("/api/v1/innsyn/saker", mockSakerData);

        await msw.mockEndpoint("/api/v1/innsyn/sak/soknad-deadline-soon/detaljer", {
            fiksDigisosId: "soknad-deadline-soon",
            soknadTittel: "Deadline tomorrow",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 1,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: { harMottattForelopigSvar: false },
            forsteOppgaveFrist: tomorrow.toISOString(),
            saker: [],
        } satisfies SaksDetaljerResponse);

        await msw.mockEndpoint("/api/v1/innsyn/sak/soknad-deadline-later/detaljer", {
            fiksDigisosId: "soknad-deadline-later",
            soknadTittel: "Deadline next week",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 1,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: { harMottattForelopigSvar: false },
            forsteOppgaveFrist: nextWeek.toISOString(),
            saker: [],
        } satisfies SaksDetaljerResponse);

        await msw.mockEndpoint("/api/v1/innsyn/sak/soknad-tasks-no-deadline/detaljer", {
            fiksDigisosId: "soknad-tasks-no-deadline",
            soknadTittel: "Tasks without deadline",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 2,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: { harMottattForelopigSvar: false },
            saker: [],
        } satisfies SaksDetaljerResponse);

        await msw.mockEndpoint("/api/v1/innsyn/sak/soknad-no-tasks-oldest/detaljer", {
            fiksDigisosId: "soknad-no-tasks-oldest",
            soknadTittel: "No tasks oldest",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: { harMottattForelopigSvar: false },
            saker: [],
        } satisfies SaksDetaljerResponse);

        await msw.mockEndpoint("/api/v1/innsyn/sak/soknad-no-tasks-newest/detaljer", {
            fiksDigisosId: "soknad-no-tasks-newest",
            soknadTittel: "No tasks newest",
            status: "UNDER_BEHANDLING",
            antallNyeOppgaver: 0,
            dokumentasjonEtterspurt: false,
            dokumentasjonkrav: false,
            vilkar: false,
            forelopigSvar: { harMottattForelopigSvar: false },
            saker: [],
        } satisfies SaksDetaljerResponse);

        await page.goto("/sosialhjelp/innsyn/nb/soknader");
        await page.getByRole("button", { name: "Nei" }).click();

        const aktiveSaker = page.getByRole("list", { name: "Aktive saker" });
        await expect(aktiveSaker).toBeVisible();

        // Get all application links in order
        const applicationLinks = aktiveSaker.getByRole("link");
        const titles = await applicationLinks.allTextContents();

        // Expected order:
        // 1. Deadline tomorrow (earliest deadline)
        // 2. Deadline next week (later deadline)
        // 3. Tasks without deadline (has tasks but no deadline)
        // 4. No tasks newest (no tasks, most recent sistOppdatert)
        // 5. No tasks oldest (no tasks, oldest sistOppdatert)
        expect(titles[0]).toContain("Deadline tomorrow");
        expect(titles[1]).toContain("Deadline next week");
        expect(titles[2]).toContain("Tasks without deadline");
        expect(titles[3]).toContain("No tasks newest");
        expect(titles[4]).toContain("No tasks oldest");
    });
});
