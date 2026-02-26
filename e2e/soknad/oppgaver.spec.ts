import { test, expect } from "@playwright/test";

import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";
import { nextWednesday } from "date-fns";
import { OppgaveResponseBeta } from "../../src/generated/model";

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

    test("should show oppgaver when there are some", async ({ page, request, baseURL }) => {
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
            oppgaver: [createOppgave("123", false)],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });

        const oppgaverList = page.getByRole("list", { name: "Oppgaver", exact: true });

        await expect(oppgaverList).toBeVisible();
    });

    test("should show correct oppgaver tag when there are unsolved tasks", async ({ page, request, baseURL }) => {
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
            oppgaver: [createOppgave("123", false)],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });

        const fullfortTag = page.getByText("0/1 fullført");

        await expect(fullfortTag).toBeVisible();
    });

    test("should show oppgaver infocard when there are unsolved tasks", async ({ page, request, baseURL }) => {
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
            oppgaver: [createOppgave("123", false)],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });
        const infoCard = page.getByRole("region", { name: "Du har fått oppgaver" });

        await expect(infoCard).toBeVisible();
        const listitem = infoCard.getByRole("list").getByRole("listitem");
        await expect(listitem).toBeVisible();
        await expect(listitem).toHaveText(/Kvittering/);
    });

    test("should not show oppgaver infocard when there are only solved tasks", async ({ page, request, baseURL }) => {
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
            oppgaver: [createOppgave("123", true)],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });
        const infoCard = page.getByRole("region", { name: "Du har fått oppgaver" });

        await expect(infoCard).not.toBeVisible();
    });

    test("should show fullført tag when there are only solved tasks", async ({ page, request, baseURL }) => {
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
            oppgaver: [createOppgave("123", true)],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });
        const fullfortTag = page.getByText("Fullført", { exact: true });

        await expect(fullfortTag).toBeVisible();
    });

    test("should truncate oppgave list to 3 when there are uncompleted tasks", async ({ page, request, baseURL }) => {
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
            oppgaver: new Array(7).fill(null).map((_, index) => createOppgave(index + "", false)),
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });
        const oppgaverRegion = page.getByRole("region", { name: "Oppgaver", exact: true });
        const oppgaverList = oppgaverRegion.getByRole("list", { name: "Oppgaver", exact: true });

        await expect(oppgaverList).toBeVisible();
        const listItems = oppgaverList.getByRole("listitem");
        await expect(listItems).toHaveCount(3);

        const showMoreButton = oppgaverRegion.getByRole("button", { name: "Vis flere oppgaver" });
        await expect(showMoreButton).toBeVisible();
        await expect(showMoreButton).toContainText("(4)");
    });

    test("should truncate oppgave list to 1 when there are only completed tasks", async ({
        page,
        request,
        baseURL,
    }) => {
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
            oppgaver: new Array(7).fill(null).map((_, index) => createOppgave(index + "", true)),
        });

        await msw.mockEndpoint("/api/v2/innsyn/test-soknad/oppgaver/ref/vedlegg", []);

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });
        const oppgaverRegion = page.getByRole("region", { name: "Oppgaver", exact: true });
        const oppgaverList = oppgaverRegion.getByRole("list", { name: "Oppgaver", exact: true });

        await expect(oppgaverList).toBeVisible();
        const listItems = oppgaverList.getByRole("listitem");
        await expect(listItems).toHaveCount(1);

        const showMoreButton = oppgaverRegion.getByRole("button", { name: "Vis flere oppgaver" });
        await expect(showMoreButton).toBeVisible();
        await expect(showMoreButton).toContainText("(6)");
    });
});

const createOppgave = (id: string, erLastetOpp: boolean): OppgaveResponseBeta => ({
    oppgaveId: id,
    tilleggsinformasjon: "kvitto",
    hendelsetype: "dokumentasjonEtterspurt",
    innsendelsesfrist: nextWednesday(new Date()).toISOString(),
    hendelsereferanse: "ref",
    erLastetOpp: erLastetOpp,
    opplastetDato: erLastetOpp ? new Date().toISOString() : undefined,
    dokumenttype: "Kvittering",
    erFraInnsyn: true,
});
