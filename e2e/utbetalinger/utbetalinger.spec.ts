import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.describe("Utbetalinger - Snarveier", () => {
    test("should navigate to Soknader page when Soknader snarvei is clicked", async ({ page }) => {
        await page.goto("/sosialhjelp/innsyn/nb/utbetaling");
        const mineSoknaderLink = page.getByRole("link", { name: "Mine søknader" });
        await expect(mineSoknaderLink).toBeVisible();

        await mineSoknaderLink.click();

        await expect(page).toHaveURL(/\/soknader/);
    });
});

test.describe("Utbetalinger - Tilknyttede søknader", () => {
    test("should show tilknyttet søknad link when utbetaling has one tilknyttet søknad", async ({
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
                utbetalingsdato: new Date().toISOString().split("T")[0],
                status: "UTBETALT",
                fiksDigisosId: "soknad-1",
                annenMottaker: false,
                tilknyttedeSoknader: [{ fiksDigisosId: "soknad-1", soknadTittel: "Søknad om livsopphold" }],
            },
        ]);

        await page.goto("/sosialhjelp/innsyn/nb/utbetaling");
        await page.getByRole("button", { name: "Siste 3 måneder" }).click();

        const card = page.getByRole("region", { name: /Livsopphold/ });
        await card.getByRole("button").click();

        await expect(card.getByText("Denne utbetalingen er knyttet til flere søknader")).toBeVisible();
        await expect(card.getByText("Søknad om livsopphold")).toBeVisible();
        await expect(card.getByText("Se søknaden og vedtaket du fikk")).not.toBeVisible();
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
                utbetalingsdato: new Date().toISOString().split("T")[0],
                status: "UTBETALT",
                fiksDigisosId: "soknad-a",
                annenMottaker: false,
                tilknyttedeSoknader: [
                    { fiksDigisosId: "soknad-a", soknadTittel: "Søknad om livsopphold", datoSendt: "2025-01-15" },
                    { fiksDigisosId: "soknad-b", soknadTittel: "Søknad om boutgifter" },
                ],
            },
        ]);

        await page.goto("/sosialhjelp/innsyn/nb/utbetaling");
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
