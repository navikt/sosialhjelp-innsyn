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
    test("should show single søknad link when utbetaling has one tilknyttet søknad", async ({
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
                tilknyttedeSoknader: ["soknad-1"],
            },
        ]);

        await page.goto("/sosialhjelp/innsyn/nb/utbetaling");
        await page.getByRole("button", { name: "Siste 3 måneder" }).click();

        const card = page.getByRole("region", { name: /Livsopphold/ });
        await card.getByRole("button").click();

        await expect(card.getByText("Se søknaden og vedtaket du fikk")).toBeVisible();
        await expect(card.getByText("Denne utbetalingen er knyttet til flere søknader")).not.toBeVisible();
    });

    test("should show multiple søknad links when utbetaling has several tilknyttede søknader", async ({
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
                tilknyttedeSoknader: ["soknad-a", "soknad-b"],
            },
        ]);

        await page.goto("/sosialhjelp/innsyn/nb/utbetaling");
        await page.getByRole("button", { name: "Siste 3 måneder" }).click();

        const card = page.getByRole("region", { name: /Boutgifter/ });
        await card.getByRole("button").click();

        await expect(card.getByText("Denne utbetalingen er knyttet til flere søknader")).toBeVisible();
        await expect(card.getByText("Se søknaden og vedtaket du fikk")).not.toBeVisible();

        const soknadLinks = card.getByRole("link", { name: "Se søknaden" });
        await expect(soknadLinks).toHaveCount(2);
    });
});
