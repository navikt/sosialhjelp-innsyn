import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";
import { endOfTomorrow, subDays } from "date-fns";

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

test.describe("Kommende utbetalinger on landingsside", () => {
    test("should display regular kommende utbetaling with correct status", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const mockUtbetalingerData = [
            {
                referanse: "utbetaling-1",
                tittel: "Livsopphold",
                belop: 15000,
                utbetalingsdato: null,
                forfallsdato: endOfTomorrow(),
                status: "PLANLAGT_UTBETALING",
                fiksDigisosId: "test-id-1",
                annenMottaker: false,
            },
        ];

        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", mockUtbetalingerData);

        await page.goto("/sosialhjelp/innsyn/nb");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("heading", { name: "Kommende utbetalinger" })).toBeVisible();
        await expect(page.getByText("Du vil motta 15 000 kr")).toBeVisible();
        await expect(page.getByText("Livsopphold")).toBeVisible();
    });

    test("should display stopped utbetaling with warning tag", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const mockUtbetalingerData = [
            {
                referanse: "utbetaling-stopped",
                tittel: "Boutgifter",
                belop: 8000,
                utbetalingsdato: null,
                forfallsdato: endOfTomorrow(),
                status: "STOPPET",
                fiksDigisosId: "test-id-1",
                annenMottaker: false,
            },
        ];

        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", mockUtbetalingerData);

        await page.goto("/sosialhjelp/innsyn/nb");
        await page.getByRole("button", { name: "Nei" }).click();

        await expect(page.getByRole("heading", { name: "Kommende utbetalinger" })).toBeVisible();
        await expect(page.getByText("Utbetalingen er stanset")).toBeVisible();
        await expect(page.getByText("Utbetales ikke")).toBeVisible();
    });
});

test.describe("Soknader on landingsside", () => {
    // En FERDIGBEHANDLET søknad eldre enn 21 dager (men nyere enn 2 måneder)
    // regnes som inaktiv, jf. isActiveSoknad i soknaderUtils.
    const inaktivSoknad = (id: string, tittel: string) => {
        const sistOppdatert = subDays(new Date(), 30).toISOString();
        return {
            sak: {
                fiksDigisosId: id,
                soknadTittel: tittel,
                sistOppdatert,
                kommunenummer: "0301",
                soknadOpprettet: subDays(new Date(), 40).toISOString(),
                isPapirSoknad: false,
            },
            detaljer: {
                fiksDigisosId: id,
                soknadTittel: tittel,
                status: "FERDIGBEHANDLET" as const,
                sistOppdatert,
                antallNyeOppgaver: 0,
                dokumentasjonEtterspurt: false,
                dokumentasjonkrav: false,
                vilkar: false,
                forelopigSvar: { harMottattForelopigSvar: false },
                saker: [],
            },
        };
    };

    const aktivSoknad = (id: string, tittel: string) => {
        const sistOppdatert = subDays(new Date(), 5).toISOString();
        return {
            sak: {
                fiksDigisosId: id,
                soknadTittel: tittel,
                sistOppdatert,
                kommunenummer: "0301",
                soknadOpprettet: subDays(new Date(), 10).toISOString(),
                isPapirSoknad: false,
            },
            detaljer: {
                fiksDigisosId: id,
                soknadTittel: tittel,
                status: "UNDER_BEHANDLING" as const,
                sistOppdatert,
                antallNyeOppgaver: 0,
                dokumentasjonEtterspurt: false,
                dokumentasjonkrav: false,
                vilkar: false,
                forelopigSvar: { harMottattForelopigSvar: false },
                saker: [],
            },
        };
    };

    test("should show tidligere soknader when the user only has inactive soknader", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const inaktiv = inaktivSoknad("inaktiv-1", "Inaktiv søknad");

        await msw.mockEmptyUtbetalinger();
        await msw.mockEmptyDriftsmeldinger();
        await msw.mockEndpoint("/api/v1/innsyn/saker", [inaktiv.sak]);
        await msw.mockDetaljer(inaktiv.detaljer.fiksDigisosId, inaktiv.detaljer);

        await page.goto("/sosialhjelp/innsyn/nb");

        await expect(page.getByRole("heading", { name: "Tidligere søknader", level: 2 })).toBeVisible();
        await expect(page.getByText("Inaktiv søknad")).toBeVisible();
        await expect(page.getByRole("heading", { name: "Aktive søknader", level: 2 })).not.toBeVisible();
    });

    test("should hide tidligere soknader when the user has both active and inactive soknader", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        const aktiv = aktivSoknad("aktiv-1", "Aktiv søknad");
        const inaktiv = inaktivSoknad("inaktiv-1", "Inaktiv søknad");

        await msw.mockEmptyUtbetalinger();
        await msw.mockEmptyDriftsmeldinger();
        await msw.mockEndpoint("/api/v1/innsyn/saker", [aktiv.sak, inaktiv.sak]);
        await msw.mockDetaljer(aktiv.detaljer.fiksDigisosId, aktiv.detaljer);
        await msw.mockDetaljer(inaktiv.detaljer.fiksDigisosId, inaktiv.detaljer);

        await page.goto("/sosialhjelp/innsyn/nb");

        await expect(page.getByRole("heading", { name: "Aktive søknader", level: 2 })).toBeVisible();
        await expect(page.getByText("Aktiv søknad")).toBeVisible();

        // I motsetning til /soknader skal tidligere søknader skjules på landingssiden
        // når brukeren har aktive søknader.
        await expect(page.getByRole("heading", { name: "Tidligere søknader", level: 2 })).not.toBeVisible();
        await expect(page.getByText("Inaktiv søknad")).not.toBeVisible();
    });

    test("should show empty state when the user has no soknader at all", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEmptyState();

        await page.goto("/sosialhjelp/innsyn/nb");

        await expect(page.getByText("Vi finner ingen søknader fra deg")).toBeVisible();
        await expect(page.getByRole("heading", { name: "Aktive søknader", level: 2 })).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Tidligere søknader", level: 2 })).not.toBeVisible();
    });
});
