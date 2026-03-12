import { test, expect, Page } from "@playwright/test";

import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";
import { HentHendelserBeta200Item } from "../../src/generated/model";

const SOKNAD_ID = "history-test-soknad";
const PAGE_URL = `/sosialhjelp/innsyn/nb/soknad/${SOKNAD_ID}`;

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

async function gotoWithHendelser(
    page: Page,
    request: Parameters<typeof createMswHelper>[0],
    baseURL: string,
    hendelser: HentHendelserBeta200Item[]
) {
    const msw = createMswHelper(request, baseURL);
    await mockSoknadEndpoints(msw, SOKNAD_ID, { hendelser });
    await page.goto(PAGE_URL);
    await page.getByRole("main").waitFor({ state: "visible" });
}

test.describe("History", () => {
    test("happy path – søknad sendt, mottatt, videresendt, under behandling og ferdig behandlet", async ({
        page,
        request,
        baseURL,
    }) => {
        await gotoWithHendelser(page, request, baseURL!, [
            { type: "Sendt", tidspunkt: "2025-11-10T10:00:00Z", navKontor: "NAV Sagene", url: "/soknad/original.pdf" },
            { type: "Mottatt", tidspunkt: "2025-11-11T10:00:00Z", navKontor: "NAV Sagene" },
            {
                type: "Videresendt",
                tidspunkt: "2025-11-12T10:00:00Z",
                navKontor: "NAV Grünerløkka",
                papirsoknad: false,
            },
            { type: "SoknadUnderBehandling", tidspunkt: "2025-11-13T10:00:00Z", navKontor: "NAV Grünerløkka" },
            { type: "SoknadFerdigBehandlet", tidspunkt: "2025-11-14T10:00:00Z" },
            {
                type: "SakFerdigBehandlet",
                tidspunkt: "2025-11-15T10:00:00Z",
                sakstittel: "Søknad om sosialhjelp",
                url: "/vedtak/1.pdf",
            },
        ]);

        // 6 events: expand the list so the oldest (Sendt) is visible
        await page.getByRole("button", { name: /Vis flere steg/ }).click();

        const sendtEvent = page.getByRole("listitem").filter({ hasText: /Søknaden din er sendt til NAV Sagene/ });
        await expect(sendtEvent).toBeVisible();
        await expect(sendtEvent.getByRole("link", { name: "Vis søknaden (åpnes i ny fane)" })).toBeVisible();

        await expect(
            page.getByRole("listitem").filter({ hasText: /Søknaden din er mottatt hos NAV Sagene/ })
        ).toBeVisible();

        await expect(
            page.getByRole("listitem").filter({ hasText: /Søknaden din er videresendt til NAV Grünerløkka/ })
        ).toBeVisible();
        await expect(
            page.getByRole("listitem").filter({ hasText: /Dette vil ikke påvirke behandlingstiden/ })
        ).toBeVisible();

        await expect(
            page.getByRole("listitem").filter({ hasText: /NAV Grünerløkka har begynt å behandle søknaden din/ })
        ).toBeVisible();
        await expect(page.getByRole("listitem").filter({ hasText: /Søknaden din er ferdig behandlet/ })).toBeVisible();

        // Single vedtak: no "nytt" label
        const vedtakEvent = page.getByRole("listitem").filter({ hasText: /Du har fått et vedtak/ });
        await expect(vedtakEvent).toBeVisible();
        await expect(vedtakEvent.getByRole("link", { name: "Vis vedtaket (åpnes i ny fane)" })).toBeVisible();
        await expect(page.getByRole("listitem").filter({ hasText: /Du har fått et nytt vedtak/ })).not.toBeVisible();
    });

    test("dokumentasjonsflyt – foreløpig svar, dokumentasjonskrav, etterspurt dokumentasjon og utbetalinger", async ({
        page,
        request,
        baseURL,
    }) => {
        await gotoWithHendelser(page, request, baseURL!, [
            { type: "ForelopigSvar", tidspunkt: "2025-11-11T10:00:00Z", navKontor: "NAV Sagene" },
            { type: "DokumentasjonKrav", tidspunkt: "2025-11-12T10:00:00Z", link: "/dokumentasjonskrav/brev.pdf" },
            // One with link, one without – both in the same timeline to cover both branches
            {
                type: "EtterspurtDokumentasjon",
                tidspunkt: "2025-11-13T10:00:00Z",
                navKontor: "NAV Sagene",
                link: "/etterspurt/brev.pdf",
            },
            { type: "EtterspurtDokumentasjon", tidspunkt: "2025-11-14T10:00:00Z", navKontor: "NAV Grünerløkka" },
            { type: "LevertEtterspurtDokumentasjon", tidspunkt: "2025-11-15T10:00:00Z", antallDokumenter: 2 },
            { type: "UtbetalingerOppdatert", tidspunkt: "2025-11-16T10:00:00Z" },
        ]);

        // 6 events: expand the list so the oldest (ForelopigSvar) is visible
        await page.getByRole("button", { name: /Vis flere steg/ }).click();

        await expect(
            page.getByRole("listitem").filter({ hasText: /NAV Sagene har sendt deg et brev om saksbehandlingstiden/ })
        ).toBeVisible();

        const dokumentasjonskravEvent = page
            .getByRole("listitem")
            .filter({ hasText: /Du har fått et dokumentasjonskrav/ });
        await expect(dokumentasjonskravEvent).toBeVisible();
        await expect(dokumentasjonskravEvent.getByRole("link", { name: "Last ned brevet her" })).toBeVisible();

        const etterspurtMedLink = page
            .getByRole("listitem")
            .filter({ hasText: /NAV Sagene trenger flere opplysninger/ });
        await expect(etterspurtMedLink).toBeVisible();
        await expect(etterspurtMedLink.getByRole("link", { name: "Vis brevet (åpnes i ny fane)" })).toBeVisible();

        const etterspurtUtenLink = page
            .getByRole("listitem")
            .filter({ hasText: /NAV Grünerløkka trenger flere opplysninger/ });
        await expect(etterspurtUtenLink).toBeVisible();
        await expect(etterspurtUtenLink.getByRole("link", { name: "Vis brevet (åpnes i ny fane)" })).not.toBeVisible();

        await expect(page.getByRole("listitem").filter({ hasText: /Du sendte inn dokumentasjon/ })).toBeVisible();

        const utbetalingEvent = page.getByRole("listitem").filter({ hasText: /Dine utbetalinger har blitt oppdatert/ });
        await expect(utbetalingEvent).toBeVisible();
        await expect(utbetalingEvent.getByRole("link", { name: "Se dine utbetalinger" })).toBeVisible();
    });

    test("kan ikke vise status – BehandlesIkke og KanIkkeViseStatus har samme tittel men ulike beskrivelser", async ({
        page,
        request,
        baseURL,
    }) => {
        await gotoWithHendelser(page, request, baseURL!, [
            { type: "BehandlesIkke", tidspunkt: "2025-11-15T10:00:00Z" },
            { type: "SakKanIkkeViseStatus", tidspunkt: "2025-11-14T10:00:00Z" },
        ]);

        await expect(
            page.getByRole("listitem").filter({ hasText: /Det kan være fordi søknaden din blir behandlet/ })
        ).toBeVisible();
        await expect(
            page.getByRole("listitem").filter({ hasText: /Søknaden din behandles, men vi kan ikke vise status/ })
        ).toBeVisible();
    });

    test("delt søknad og vedtak på flere saker – søknaden deles opp, vedtak viser sakstittel eller nytt-label", async ({
        page,
        request,
        baseURL,
    }) => {
        // hasMultipleCases = true when there are SakUnderBehandling events with different sakstittel.
        // The SakUnderBehandling events are also collapsed into a single DeltSøknad event.
        await gotoWithHendelser(page, request, baseURL!, [
            { type: "SakUnderBehandling", tidspunkt: "2025-11-10T10:00:00Z", sakstittel: "Sak A" },
            { type: "SakUnderBehandling", tidspunkt: "2025-11-10T10:00:00Z", sakstittel: "Sak B" },
            {
                type: "SakFerdigBehandlet",
                tidspunkt: "2025-11-20T10:00:00Z",
                sakstittel: "Sak A",
                url: "/vedtak/a2.pdf",
            },
            {
                type: "SakFerdigBehandlet",
                tidspunkt: "2025-11-15T10:00:00Z",
                sakstittel: "Sak A",
                url: "/vedtak/a1.pdf",
            },
            {
                type: "SakFerdigBehandlet",
                tidspunkt: "2025-11-18T10:00:00Z",
                sakstittel: "Sak B",
                url: "/vedtak/b.pdf",
            },
        ]);

        // The two SakUnderBehandling events are replaced by a single DeltSøknad event
        await expect(
            page.getByRole("listitem").filter({ hasText: /Søknaden din er delt opp i flere saker/ })
        ).toBeVisible();
        await expect(
            page.getByRole("listitem").filter({
                hasText:
                    /Søknaden din har blitt delt opp i flere saker siden det er behov for å behandle deler av søknaden separat/,
            })
        ).toBeVisible();

        // Newest vedtak for Sak A (isNew=true) → standard "nytt vedtak" title, not sakstittel format
        await expect(page.getByRole("listitem").filter({ hasText: /Du har fått et nytt vedtak/ })).toBeVisible();
        // Older vedtak for Sak A (isNew=false) → sakstittel format since hasMultipleCases=true
        await expect(page.getByRole("listitem").filter({ hasText: /Sak A er ferdig behandlet/ })).toBeVisible();
        // Single vedtak for Sak B (isNew=false) → sakstittel format
        await expect(page.getByRole("listitem").filter({ hasText: /Sak B er ferdig behandlet/ })).toBeVisible();
    });

    test("vis mer/færre – skjuler eldre hendelser og viser knapp når det er mer enn 5", async ({
        page,
        request,
        baseURL,
    }) => {
        await gotoWithHendelser(page, request, baseURL!, [
            { type: "SoknadFerdigBehandlet", tidspunkt: "2025-11-20T10:00:00Z" },
            { type: "LevertEtterspurtDokumentasjon", tidspunkt: "2025-11-19T10:00:00Z", antallDokumenter: 1 },
            { type: "EtterspurtDokumentasjon", tidspunkt: "2025-11-18T10:00:00Z", navKontor: "NAV Oslo" },
            { type: "UtbetalingerOppdatert", tidspunkt: "2025-11-17T10:00:00Z" },
            { type: "SoknadUnderBehandling", tidspunkt: "2025-11-16T10:00:00Z", navKontor: "NAV Oslo" },
            { type: "Mottatt", tidspunkt: "2025-11-15T10:00:00Z", navKontor: "NAV Oslo" },
        ]);

        // 6th (oldest) event hidden behind the "show more" button
        await expect(page.getByRole("button", { name: /Vis flere steg \(1\)/ })).toBeVisible();
        await expect(
            page.getByRole("listitem").filter({ hasText: /Søknaden din er mottatt hos NAV Oslo/ })
        ).not.toBeVisible();

        // Clicking expands all events and the button label switches
        await page.getByRole("button", { name: /Vis flere steg \(1\)/ }).click();
        await expect(page.getByRole("button", { name: /Vis færre steg/ })).toBeVisible();
        await expect(
            page.getByRole("listitem").filter({ hasText: /Søknaden din er mottatt hos NAV Oslo/ })
        ).toBeVisible();
    });
});
