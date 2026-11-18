import { expect, test, type Page } from "@playwright/test";
import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";

const id = "klage-navigation";
const soknadUrl = `/sosialhjelp/innsyn/soknad/${id}`;
const klageUrl = `/sosialhjelp/innsyn/klage/opprett/${id}/vedtak-1`;

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
    await mockSoknadEndpoints(msw, id, {
        saksStatus: [
            {
                status: "FERDIGBEHANDLET",
                tittel: "Sak",
                referanse: "sak-1",
                skalViseVedtakInfoPanel: false,
                vedtak: [
                    { id: "vedtak-1", utfall: "AVSLATT", dato: new Date().toISOString(), vedtaksFilUrl: "/vedtak.pdf" },
                ],
            },
        ],
    });
    await msw.mockEndpoint(`/api/v1/innsyn/${id}/sak/vedtak-1`, {
        tittel: "Søknad om økonomisk sosialhjelp",
        vedtaksdato: new Date().toISOString(),
        navEnhetNavn: "Nav Oslo",
    });
});

test.afterEach(async ({ request, baseURL }) => {
    await createMswHelper(request, baseURL!).reset();
});

async function openForm(page: Page) {
    await page.goto(soknadUrl);
    await page.getByRole("link", { name: "Klag på vedtaket" }).click();
    await expect(page).toHaveURL(new RegExp(`${klageUrl}$`));
    await expect(page.getByRole("textbox", { name: "Hvorfor er du uenig i vedtaket?" })).toBeVisible();
}

test("back warns, keeps the form on cancel, and leaves on confirmation", async ({ page }) => {
    await openForm(page);
    const text = page.getByRole("textbox", { name: "Hvorfor er du uenig i vedtaket?" });
    await text.fill("Min begrunnelse");

    const firstDialog = page.waitForEvent("dialog");
    await page.evaluate(() => history.back());
    const dialog = await firstDialog;
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toContain("mister du innholdet i klagen");
    await dialog.dismiss();
    await expect(page).toHaveURL(new RegExp(`${klageUrl}$`));
    await expect(text).toHaveValue("Min begrunnelse");

    const secondDialog = page.waitForEvent("dialog");
    await page.evaluate(() => history.back());
    await (await secondDialog).accept();
    await expect(page).toHaveURL(new RegExp(`${soknadUrl}$`));
    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`${klageUrl}$`));
});

test("back from an empty form does not warn", async ({ page }) => {
    await openForm(page);
    page.on("dialog", (dialog) => {
        throw new Error(`Unexpected ${dialog.type()} dialog`);
    });
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${soknadUrl}$`));
});
