import { test, expect, type Page } from "@playwright/test";

import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";
import { DokumentasjonkravDto, SaksStatusResponse, VilkarResponse } from "../../src/generated/model";
import { addDays, formatISO, subDays } from "date-fns";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

const defaultSaksStatus: SaksStatusResponse[] = [
    {
        status: "UNDER_BEHANDLING",
        tittel: "Sak",
        referanse: "9824",
        skalViseVedtakInfoPanel: false,
        vedtak: [],
    },
];

const createVilkar = (
    referanse: string,
    status: VilkarResponse["status"],
    hendelsetidspunkt: string,
    tittel = `Vilkår ${referanse}`
): VilkarResponse => ({
    vilkarReferanse: referanse,
    status,
    hendelsetidspunkt,
    tittel,
    beskrivelse: `Beskrivelse for vilkår ${referanse}`,
});

const createDokKrav = (
    id: string,
    frist: string | undefined,
    erLastetOpp: boolean,
    tittel = `Dokumentasjonkrav ${id}`
): DokumentasjonkravDto => ({
    dokumentasjonkravId: id,
    dokumentasjonkravReferanse: `ref-${id}`,
    hendelsetidspunkt: new Date().toISOString(),
    status: "IKKE_OPPFYLT",
    erLastetOpp,
    utbetalingsReferanse: [],
    tittel,
    beskrivelse: `Beskrivelse for dokumentasjonkrav ${id}`,
    frist,
    opplastetDato: erLastetOpp ? new Date().toISOString() : undefined,
});

test.describe("Vilkår", () => {
    test("should show vilkår info card with 'kan ha vilkår' when there is a positive outcome, but no vilkår/dokkrav", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "5587b966-9186-4596-906e-a0c4d7305ecf";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: [
                {
                    status: "FERDIGBEHANDLET",
                    vedtak: [
                        { id: "123", utfall: "INNVILGET", dato: new Date().toISOString(), vedtaksFilUrl: "abc.com" },
                    ],
                    utfallVedtak: "INNVILGET",
                    tittel: "Søknad",
                    skalViseVedtakInfoPanel: true,
                },
            ],
            vilkar: [],
            dokumentasjonkrav: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/" + uuid);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByText(/Beklager/)).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Du kan ha fått vilkår", level: 2, exact: true })).toBeVisible();
    });

    test("should show vilkår info card with 'Du har fått vilkår' when there are vilkår/dokkrav", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "5587b966-9186-4596-906e-a0c4d7305ecf";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: [
                {
                    status: "FERDIGBEHANDLET",
                    vedtak: [
                        { id: "123", utfall: "INNVILGET", dato: new Date().toISOString(), vedtaksFilUrl: "abc.com" },
                    ],
                    utfallVedtak: "INNVILGET",
                    tittel: "Søknad",
                    skalViseVedtakInfoPanel: true,
                },
            ],
            vilkar: [
                {
                    status: "RELEVANT",
                    tittel: "Du må møte opp på kontoret",
                    hendelsetidspunkt: new Date().toISOString(),
                    vilkarReferanse: "123",
                },
            ],
            dokumentasjonkrav: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/" + uuid);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByText(/Beklager/)).not.toBeVisible();
        await expect(
            page.getByRole("heading", { name: "Du kan ha fått vilkår", level: 2, exact: true })
        ).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Du har fått vilkår", level: 2, exact: true })).toBeVisible();
    });

    test("should not show vilkår section when there are no vilkår or dokumentasjonkrav", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "079bff6a-91c1-4f08-9fb5-21fe800002a5";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [],
            dokumentasjonkrav: [],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/" + uuid);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByText(/Beklager/)).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Vilkår", level: 2, exact: true })).not.toBeVisible();
    });

    test("should show vilkår section when there are relevant vilkår", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "4144bc23-eeaa-4d93-831b-74b8063fb8fb";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", new Date().toISOString())],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("heading", { name: "Vilkår", level: 2, exact: true })).toBeVisible();
    });

    test("should show vilkår section when there are uncompleted dokumentasjonkrav", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "e497e477-85ce-4fba-bc3e-1105f035d5c2";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            dokumentasjonkrav: [createDokKrav("d1", formatISO(addDays(new Date(), 1)), false)],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("heading", { name: "Vilkår", level: 2, exact: true })).toBeVisible();
    });

    test("should render vilkår title and description", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "99c23b26-b69f-4b33-ac08-1485d914e995";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", formatISO(new Date()), "Møte med Nav")],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("heading", { name: "Møte med Nav", level: 3 })).toBeVisible();
        await expect(page.getByText("Beskrivelse for vilkår v1")).toBeVisible();
    });
});

test.describe("VilkarReadMore", () => {
    test("should show VilkarReadMore when there are relevant vilkår (RELEVANT)", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "96e18a9a-381a-4e2b-9927-419de69195bd";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "RELEVANT", new Date().toISOString())],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("button", { name: "Hvordan fungerer vilkår?" })).toBeVisible();
    });

    test("should expand VilkarReadMore on click and show content", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "8d437171-7932-4b5f-b445-330baa43f19d";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", new Date().toISOString())],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        const readMore = page.getByRole("button", { name: "Hvordan fungerer vilkår?" });
        await readMore.click();

        await expect(page.getByText("Les mer om vilkår her")).toBeVisible();
    });
});

test.describe("DokKravReadMore", () => {
    const getDokKravReadMoreBtn = (page: Page) =>
        page
            .getByRole("region", { name: "Vilkår" })
            .getByRole("button", { name: "Tips til å sende inn dokumentasjon" });

    test("should show DokKravReadMore when there are uncompleted dokumentasjonkrav", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "7fc12773-4f73-4221-8632-781341633af6";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            dokumentasjonkrav: [createDokKrav("d1", new Date(Date.now() + 86400000).toISOString(), false)],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(getDokKravReadMoreBtn(page)).toBeVisible();
    });

    test("should not show DokKravReadMore when all dokumentasjonkrav are uploaded", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "c32d689a-f84a-469a-8bd1-667ec1139eee";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", new Date().toISOString())],
            dokumentasjonkrav: [createDokKrav("d1", new Date().toISOString(), true)],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(getDokKravReadMoreBtn(page)).not.toBeVisible();
    });

    test("should not show DokKravReadMore when dokumentasjonkrav has ANNULLERT status", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "9367b68f-c972-42cd-8647-a03b27cf8276";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", new Date().toISOString())],
            dokumentasjonkrav: [{ ...createDokKrav("d1", undefined, false), status: "ANNULLERT" }],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(getDokKravReadMoreBtn(page)).not.toBeVisible();
    });

    test("should show both ReadMore sections when both relevant vilkår and uncompleted dokumentasjonkrav are present", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "5da62d3d-f5d4-45fc-9984-f4ca697c4993";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "RELEVANT", new Date().toISOString())],
            dokumentasjonkrav: [createDokKrav("d1", new Date(Date.now() + 86400000).toISOString(), false)],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("button", { name: "Hvordan fungerer vilkår?" })).toBeVisible();
        await expect(getDokKravReadMoreBtn(page)).toBeVisible();
    });

    test("should expand DokKravReadMore on click and show content", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "413ff800-c795-4a64-865e-e2cabac7828c";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            dokumentasjonkrav: [createDokKrav("d1", addDays(new Date(), 1).toISOString(), false)],
        });
        await msw.mockEndpoint(`/api/v2/innsyn/${uuid}/oppgaver/ref-d1/vedlegg`, []);

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await getDokKravReadMoreBtn(page).click();

        await expect(page.getByRole("heading", { name: "Problemer med å sende inn" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Dokumentasjon du har på papir" })).toBeVisible();
    });
});

test.describe("Dokumentasjonkrav rendering", () => {
    test("should not render dokumentasjonkrav with ANNULLERT status", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "9d6bdd50-f5bf-476b-8f5d-2dc45890af26";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", new Date().toISOString())],
            dokumentasjonkrav: [
                { ...createDokKrav("d1", undefined, false, "Annullert dokument"), status: "ANNULLERT" },
            ],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByText("Annullert dokument")).not.toBeVisible();
    });

    test("should render dokumentasjonkrav when there are completed dokkrav", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "9d6bdd50-f5bf-476b-8f5d-2dc45890af26";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "OPPFYLT", new Date().toISOString())],
            dokumentasjonkrav: [{ ...createDokKrav("d1", undefined, true, "Levert dokument"), status: "RELEVANT" }],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByText("Levert dokument")).not.toBeVisible();
    });
});

test.describe("Sort order", () => {
    test("should sort uncompleted dokumentasjonkrav by frist ascending (earliest first)", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const earlierFrist = formatISO(addDays(new Date(), 2));
        const laterFrist = formatISO(addDays(new Date(), 7));

        const uuid = "67cdfb6a-1280-4ebd-955d-91e62db459b0";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            dokumentasjonkrav: [
                createDokKrav("d1", laterFrist, false, "Sent frist dokument"),
                createDokKrav("d2", earlierFrist, false, "Tidlig frist dokument"),
            ],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        const vilkarRegion = page.getByRole("region", { name: "Vilkår", exact: true });
        await vilkarRegion.waitFor({ state: "visible" });

        const listItems = await vilkarRegion.getByRole("listitem").all();

        expect(listItems).toHaveLength(2);

        await expect(listItems[0]).toHaveText(/Tidlig frist dokument/);
        await expect(listItems[1]).toHaveText(/Sent frist dokument/);
    });

    test("should place dokumentasjonkrav without frist last", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const uuid = "6f3ea270-3b44-4759-a7df-d19e22e21039";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            dokumentasjonkrav: [
                createDokKrav("d1", undefined, false, "Uten frist dokument"),
                createDokKrav("d2", addDays(new Date(), 30).toISOString(), false, "Med frist dokument"),
            ],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        const vilkarRegion = page.getByRole("region", { name: "Vilkår", exact: true });
        await vilkarRegion.waitFor({ state: "visible" });

        const listItems = await vilkarRegion.getByRole("listitem").all();

        expect(listItems).toHaveLength(2);

        await expect(listItems[0]).toHaveText(/Med frist dokument/);
        await expect(listItems[1]).toHaveText(/Uten frist dokument/);
    });

    test("should sort vilkår by hendelsetidspunkt ascending (earliest first)", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const earlierTime = subDays(new Date(), 4).toISOString();
        const laterTime = subDays(new Date(), 1).toISOString();

        const uuid = "82646f56-a5d4-48ef-bd45-55287300df48";
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [
                createVilkar("v1", "IKKE_OPPFYLT", laterTime, "Sent vilkår"),
                createVilkar("v2", "IKKE_OPPFYLT", earlierTime, "Tidlig vilkår"),
            ],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        const vilkarRegion = page.getByRole("region", { name: "Vilkår", exact: true });
        await vilkarRegion.waitFor({ state: "visible" });

        const listItems = await vilkarRegion.getByRole("listitem").all();

        expect(listItems).toHaveLength(2);

        await expect(listItems[0]).toHaveText(/Tidlig vilkår/);
        await expect(listItems[1]).toHaveText(/Sent vilkår/);
    });

    test("should place completed dokumentasjonkrav last after vilkar", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        const uuid = "82646f56-a5d4-48ef-bd45-55287300df48";
        await msw.mockEndpoint("/api/v2/innsyn/82646f56-a5d4-48ef-bd45-55287300df48/oppgaver/ref-dok2/vedlegg", []);
        await mockSoknadEndpoints(msw, uuid, {
            saksStatus: defaultSaksStatus,
            vilkar: [createVilkar("v1", "IKKE_OPPFYLT", new Date().toISOString(), "Sent vilkår")],
            dokumentasjonkrav: [
                createDokKrav("dok1", formatISO(addDays(new Date(), 2)), false, "Uløst krav"),
                createDokKrav("dok2", formatISO(subDays(new Date(), 2)), true, "Løst krav"),
            ],
        });

        await page.goto(`/sosialhjelp/innsyn/nb/soknad/${uuid}`);
        await page.getByRole("main").waitFor({ state: "visible" });

        const vilkarRegion = page.getByRole("region", { name: "Vilkår", exact: true });
        await vilkarRegion.waitFor({ state: "visible" });

        const listItems = await vilkarRegion.getByRole("list").getByRole("listitem").all();

        expect(listItems.length).toBeGreaterThanOrEqual(3);
        await expect(listItems[0]).toContainText(/Uløst krav/);
        await expect(listItems[1]).toContainText(/Sent vilkår/);
        await expect(listItems[2]).toContainText(/Løst krav/);
    });
});
