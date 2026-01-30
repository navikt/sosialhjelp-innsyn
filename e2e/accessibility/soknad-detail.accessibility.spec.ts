import { test, expect } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";
import { checkAccessibility } from "../helpers/accessibility-helpers";
import {
    type DokumentasjonkravDto,
    HendelseDto,
    KlageDto,
    OppgaveResponseBeta,
    OriginalSoknadDto,
    SaksStatusResponse,
    SoknadsStatusResponse,
    VilkarResponse,
} from "../../src/generated/model";
import type { ForelopigSvarResponse, VedleggResponse } from "../../src/generated/ssr/model";
import { endOfYesterday, nextTuesday } from "date-fns";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Soknad detail page accessibility", () => {
    test("should not have any automatically detectable accessibility issues", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const mockSoknadsStatusData: SoknadsStatusResponse = {
            status: "UNDER_BEHANDLING",
            kommunenummer: "0301",
            tidspunktSendt: "2025-11-15T10:00:00Z",
            soknadsalderIMinutter: 1000,
            navKontor: "NAV Oslo",
            tittel: "Søknad om økonomisk sosialhjelp",
        };

        // Mock all the endpoints that the Soknad component calls
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/soknadsStatus", mockSoknadsStatusData);
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/vedlegg", [
            {
                url: "/abc/",
                type: "whan",
                datoLagtTil: new Date().toISOString(),
                filnavn: "StorFil",
                storrelse: 1000,
                tilleggsinfo: "annet",
            },
        ] satisfies VedleggResponse[]);
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/originalSoknad", {
            url: "/original.pdf",
            date: new Date().toISOString(),
            size: 1000,
            filename: "soknad.pdf",
        } satisfies OriginalSoknadDto);
        await msw.mockEndpoint("/api/v2/innsyn/test-soknad-1/oppgaver", [
            {
                erFraInnsyn: true,
                dokumenttype: "what",
                erLastetOpp: false,
                hendelsereferanse: "123",
                oppgaveId: "123",
                hendelsetype: "dokumentasjonEtterspurt",
                innsendelsesfrist: nextTuesday(new Date()).toISOString(),
                tilleggsinformasjon: "Trenger bilde",
            },
            {
                erFraInnsyn: true,
                dokumenttype: "Bilde",
                erLastetOpp: true,
                hendelsereferanse: "1234",
                oppgaveId: "1234",
                hendelsetype: "dokumentasjonEtterspurt",
                innsendelsesfrist: nextTuesday(new Date()).toISOString(),
                tilleggsinformasjon: "Trenger bilde",
                opplastetDato: endOfYesterday().toISOString(),
            },
        ] satisfies OppgaveResponseBeta[]);
        await msw.mockEndpoint("/api/v2/innsyn/test-soknad-1/dokumentasjonkrav", [
            {
                dokumentasjonkravId: "abc",
                erLastetOpp: false,
                hendelsetype: "dokumentasjonkrav",
                tittel: "Bilde av betalt husleie",
                beskrivelse: "Må være bra bilde",
                dokumentasjonkravReferanse: "92387",
                frist: nextTuesday(new Date()).toISOString(),
                status: "RELEVANT",
                utbetalingsReferanse: ["9828"],
                hendelsetidspunkt: new Date().toISOString(),
                saksreferanse: "9824",
            },
        ] satisfies DokumentasjonkravDto[]);
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/forelopigSvar", {
            harMottattForelopigSvar: false,
        } satisfies ForelopigSvarResponse);
        await msw.mockEndpoint("/api/v2/innsyn/test-soknad-1/vilkar", [] satisfies VilkarResponse[]);
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/saksStatus", [
            { status: "UNDER_BEHANDLING", tittel: "Sak 1", referanse: "9823", skalViseVedtakInfoPanel: false },
            {
                status: "FERDIGBEHANDLET",
                tittel: "Sak 2 om nødhjelp",
                referanse: "9824",
                skalViseVedtakInfoPanel: false,
                utfallVedtak: "INNVILGET",
                vedtaksfilUrlList: [{ url: "/abc", id: "879324" }],
            },
        ] satisfies SaksStatusResponse[]);
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/klager", [] satisfies KlageDto[]);
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/hendelser/beta", [] satisfies HendelseDto[]);

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");

        // Wait for main content to be loaded
        await page.locator("#maincontent").waitFor({ state: "visible" });

        await expect(page.getByText("Beklager, noe gikk galt")).not.toBeVisible();

        const results = await checkAccessibility(page);

        expect(results.violations).toEqual([]);
    });
});
