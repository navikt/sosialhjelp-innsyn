import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";

/** Lokal dato som "yyyy-MM-dd". toISOString() bruker UTC og gir feil dag rundt midnatt. */
const lokalDato = (dagerFraIDag = 0): string => {
    const d = new Date();
    d.setDate(d.getDate() + dagerFraIDag);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
};

const iDag = lokalDato(0);
const iGar = lokalDato(-1);
const iMorgen = lokalDato(1);

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.describe("Utbetalinger - Snarveier", () => {
    test("should navigate to Soknader page when Soknader snarvei is clicked", async ({ page }) => {
        await page.goto("/sosialhjelp/innsyn/utbetaling");
        const mineSoknaderLink = page.getByRole("link", { name: "Mine søknader" });
        await expect(mineSoknaderLink).toBeVisible();

        await mineSoknaderLink.click();

        await expect(page).toHaveURL(/\/soknader/);
    });
});

test.describe("Utbetalinger - Tilknyttede søknader", () => {
    test("should show default søknad link when utbetaling has one or zero tilknyttede søknader", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", [
            {
                referanse: "utbetaling-single",
                tittel: "Livsopphold",
                belop: 5000,
                utbetalingsdato: iGar,
                status: "UTBETALT",
                fiksDigisosId: "soknad-1",
                annenMottaker: false,
                tilknyttedeSoknader: [{ fiksDigisosId: "soknad-1", soknadTittel: "Søknad om livsopphold" }],
            },
        ]);

        await page.goto("/sosialhjelp/innsyn/utbetaling");
        await page.getByRole("button", { name: "Siste 3 måneder" }).click();

        const card = page.getByRole("region", { name: /Livsopphold/ });
        await card.getByRole("button").click();

        await expect(card.getByText("Se søknaden og vedtaket du fikk")).toBeVisible();
        await expect(card.getByText("Denne utbetalingen er knyttet til flere søknader")).not.toBeVisible();
    });

    test("should show both søknad titles when utbetaling has multiple tilknyttede søknader", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", [
            {
                referanse: "utbetaling-multi",
                tittel: "Boutgifter",
                belop: 8000,
                utbetalingsdato: iGar,
                status: "UTBETALT",
                fiksDigisosId: "soknad-a",
                annenMottaker: false,
                tilknyttedeSoknader: [
                    { fiksDigisosId: "soknad-a", soknadTittel: "Søknad om livsopphold", datoSendt: "2025-01-15" },
                    { fiksDigisosId: "soknad-b", soknadTittel: "Søknad om boutgifter" },
                ],
            },
        ]);

        await page.goto("/sosialhjelp/innsyn/utbetaling");
        await page.getByRole("button", { name: "Siste 3 måneder" }).click();

        const card = page.getByRole("region", { name: /Boutgifter/ });
        await card.getByRole("button").click();

        await expect(card.getByText("Denne utbetalingen er knyttet til flere søknader")).toBeVisible();
        await expect(card.getByText("Se søknaden og vedtaket du fikk")).not.toBeVisible();

        await expect(card.getByText(/Søknad om livsopphold/)).toBeVisible();
        await expect(card.getByText("Søknad om boutgifter")).toBeVisible();

        await expect(card.getByRole("link")).toHaveCount(2);
    });
});

test.describe("Utbetalinger - Dagens utbetalinger", () => {
    const utbetaling = (overrides: Record<string, unknown>) => ({
        belop: 5000,
        fiksDigisosId: "soknad-1",
        annenMottaker: false,
        tilknyttedeSoknader: [],
        ...overrides,
    });

    test.beforeEach(async ({ request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEndpoint("/api/v2/innsyn/utbetalinger", [
            utbetaling({
                referanse: "planlagt-i-dag",
                tittel: "Planlagt i dag",
                forfallsdato: iDag,
                status: "PLANLAGT_UTBETALING",
            }),
            utbetaling({
                referanse: "utbetalt-i-dag",
                tittel: "Utbetalt i dag",
                forfallsdato: iGar,
                utbetalingsdato: iDag,
                status: "UTBETALT",
            }),
            utbetaling({
                referanse: "planlagt-i-morgen",
                tittel: "Planlagt i morgen",
                forfallsdato: iMorgen,
                status: "PLANLAGT_UTBETALING",
            }),
            utbetaling({
                referanse: "utbetalt-i-gar",
                tittel: "Utbetalt i går",
                forfallsdato: iGar,
                utbetalingsdato: iGar,
                status: "UTBETALT",
            }),
        ]);
    });

    test("viser dagens utbetalinger under Kommende", async ({ page }) => {
        await page.goto("/sosialhjelp/innsyn/utbetaling");
        await page.getByRole("button", { name: "Kommende", exact: true }).click();

        await expect(page.getByRole("region", { name: /Planlagt i dag/ })).toBeVisible();
        await expect(page.getByRole("region", { name: /Utbetalt i dag/ })).toBeVisible();
        await expect(page.getByRole("region", { name: /Planlagt i morgen/ })).toBeVisible();
        await expect(page.getByRole("region", { name: /Utbetalt i går/ })).toHaveCount(0);
    });

    test("viser ikke dagens utbetalinger under Siste 3 måneder", async ({ page }) => {
        await page.goto("/sosialhjelp/innsyn/utbetaling");
        await page.getByRole("button", { name: "Siste 3 måneder" }).click();

        await expect(page.getByRole("region", { name: /Utbetalt i går/ })).toBeVisible();
        await expect(page.getByRole("region", { name: /Utbetalt i dag/ })).toHaveCount(0);
        await expect(page.getByRole("region", { name: /Planlagt i dag/ })).toHaveCount(0);
    });
});
