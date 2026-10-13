import { test, expect } from "@playwright/test";

import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";
import { VedtakDto } from "../../src/generated/model";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Vedtak functionality", () => {
    test("should display multiple vedtak in a list with the newest on top", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        // Create two vedtak with different dates - oldest first, newest last
        const olderVedtak: VedtakDto = {
            id: "vedtak-1",
            utfall: "INNVILGET",
            vedtaksFilUrl: "/vedtak/1.pdf",
            dato: "2025-11-20",
        };

        const newerVedtak: VedtakDto = {
            id: "vedtak-2",
            utfall: "DELVIS_INNVILGET",
            vedtaksFilUrl: "/vedtak/2.pdf",
            dato: "2025-11-25",
        };

        await mockSoknadEndpoints(msw, "test-soknad-1", {
            saksStatus: [
                {
                    status: "FERDIGBEHANDLET",
                    tittel: "Sak med flere vedtak",
                    referanse: "9824",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [olderVedtak, newerVedtak],
                    utfallVedtak: "DELVIS_INNVILGET",
                },
            ],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");

        // Wait for main content to be loaded
        await page.getByRole("main").waitFor({ state: "visible" });

        const vedtakList = page.getByRole("list", { name: "Vedtak" });

        // The newest vedtak is visible first and older vedtak can be expanded.
        await expect(vedtakList.getByRole("listitem")).toHaveCount(1);
        await expect(vedtakList.getByRole("heading", { name: "Vedtak 25.11.2025" })).toBeVisible();
        await page.getByRole("button", { name: "Vis flere vedtak (1)" }).click();

        await expect(vedtakList.getByRole("listitem")).toHaveCount(2);
        await expect(vedtakList.getByRole("link", { name: "Åpne vedtaksbrev" })).toHaveCount(2);
        await expect(vedtakList.getByRole("heading", { level: 3, name: /^Vedtak / })).toHaveText([
            "Vedtak 25.11.2025",
            "Vedtak 20.11.2025",
        ]);
    });

    test("should display the latest decision status beside the title", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const olderVedtak: VedtakDto = {
            id: "vedtak-1",
            utfall: "INNVILGET",
            vedtaksFilUrl: "/vedtak/1.pdf",
            dato: "2025-11-20",
        };

        const newerVedtak: VedtakDto = {
            id: "vedtak-2",
            utfall: "AVSLATT",
            vedtaksFilUrl: "/vedtak/2.pdf",
            dato: "2025-11-25",
        };

        await mockSoknadEndpoints(msw, "test-soknad-1", {
            saksStatus: [
                {
                    status: "FERDIGBEHANDLET",
                    tittel: "Sak med flere vedtak",
                    referanse: "9824",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [olderVedtak, newerVedtak],
                    utfallVedtak: "AVSLATT",
                },
            ],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");

        await page.getByRole("main").waitFor({ state: "visible" });

        // Find the "Vedtak" section heading
        const vedtakSection = page.getByRole("heading", { name: "Vedtak", exact: true, level: 2 });
        await expect(vedtakSection).toBeVisible();

        const newestVedtak = page.getByRole("list", { name: "Vedtak" }).getByRole("listitem");

        await expect(newestVedtak.getByRole("heading", { name: "Vedtak 25.11.2025" })).toBeVisible();
        await expect(newestVedtak.getByText(/^(Utfall: )?Avslag$/)).toBeVisible();
    });

    test("should show one vedtak without an expand button when there is a single vedtak", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const singleVedtak: VedtakDto = {
            id: "vedtak-1",
            utfall: "INNVILGET",
            vedtaksFilUrl: "/vedtak/1.pdf",
            dato: "2025-11-20",
        };

        await mockSoknadEndpoints(msw, "test-soknad-1", {
            saksStatus: [
                {
                    status: "FERDIGBEHANDLET",
                    tittel: "Sak med ett vedtak",
                    referanse: "9824",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [singleVedtak],
                    utfallVedtak: "INNVILGET",
                },
            ],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");

        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("link", { name: "Åpne vedtaksbrev" })).toBeVisible();
        await expect(page.getByRole("button", { name: /Vis flere vedtak/ })).toHaveCount(0);
    });

    test("should display three vedtak sorted with the newest first", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        // Create three vedtak with different dates
        const oldestVedtak: VedtakDto = {
            id: "vedtak-1",
            utfall: "INNVILGET",
            vedtaksFilUrl: "/vedtak/1.pdf",
            dato: "2025-11-15",
        };

        const middleVedtak: VedtakDto = {
            id: "vedtak-2",
            utfall: "DELVIS_INNVILGET",
            vedtaksFilUrl: "/vedtak/2.pdf",
            dato: "2025-11-20",
        };

        const newestVedtak: VedtakDto = {
            id: "vedtak-3",
            utfall: "AVSLATT",
            vedtaksFilUrl: "/vedtak/3.pdf",
            dato: "2025-11-28",
        };

        await mockSoknadEndpoints(msw, "test-soknad-1", {
            saksStatus: [
                {
                    status: "FERDIGBEHANDLET",
                    tittel: "Sak med tre vedtak",
                    referanse: "9824",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [oldestVedtak, middleVedtak, newestVedtak],
                    utfallVedtak: "AVSLATT",
                },
            ],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");

        await page.getByRole("main").waitFor({ state: "visible" });

        const vedtakList = page.getByRole("list", { name: "Vedtak" });

        await expect(vedtakList.getByRole("listitem")).toHaveCount(1);
        await page.getByRole("button", { name: "Vis flere vedtak (2)" }).click();

        await expect(vedtakList.getByRole("listitem")).toHaveCount(3);
        await expect(vedtakList.getByRole("link", { name: "Åpne vedtaksbrev" })).toHaveCount(3);
        await expect(vedtakList.getByRole("heading", { level: 3, name: /^Vedtak / })).toHaveText([
            "Vedtak 28.11.2025",
            "Vedtak 20.11.2025",
            "Vedtak 15.11.2025",
        ]);
        await expect(
            vedtakList
                .getByRole("listitem")
                .first()
                .getByText(/^(Utfall: )?Avslag$/)
        ).toBeVisible();
    });

    test("should display a block for each sak with decisions before cases under treatment", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        await mockSoknadEndpoints(msw, "test-soknad-1", {
            saksStatus: [
                {
                    status: "UNDER_BEHANDLING",
                    tittel: "Strøm",
                    referanse: "sak-a",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [],
                },
                {
                    status: "IKKE_INNSYN",
                    tittel: "Mat",
                    referanse: "sak-c",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [],
                },
                {
                    status: "FERDIGBEHANDLET",
                    tittel: "Husleie",
                    referanse: "sak-b",
                    skalViseVedtakInfoPanel: false,
                    vedtak: [
                        {
                            id: "vedtak-1",
                            utfall: "INNVILGET",
                            vedtaksFilUrl: "/vedtak/1.pdf",
                            dato: "2025-11-20",
                        },
                        {
                            id: "vedtak-2",
                            utfall: "AVSLATT",
                            vedtaksFilUrl: "/vedtak/2.pdf",
                            dato: "2025-11-25",
                        },
                    ],
                },
            ],
        });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");

        await page.getByRole("main").waitFor({ state: "visible" });

        await expect(page.getByRole("heading", { name: "Vedtak", exact: true, level: 2 })).toHaveCount(0);
        await expect(page.getByRole("heading", { name: "Husleie", exact: true, level: 2 })).toHaveCount(1);

        const sakHeadings = page.getByRole("heading", { level: 2 }).filter({ hasText: /^(Husleie|Strøm|Mat)$/ });
        await expect(sakHeadings).toHaveText(["Husleie", "Strøm", "Mat"]);

        const husleieVedtak = page.getByRole("list", { name: "Husleie" });
        await expect(husleieVedtak.getByRole("listitem")).toHaveCount(1);
        await expect(husleieVedtak.getByRole("heading", { name: "Vedtak 25.11.2025" })).toBeVisible();
        await expect(husleieVedtak.getByText(/^(Utfall: )?Avslag$/)).toBeVisible();
        await page.getByRole("button", { name: "Vis flere vedtak (1)" }).click();
        await expect(husleieVedtak.getByRole("heading", { level: 3, name: /^Vedtak / })).toHaveText([
            "Vedtak 25.11.2025",
            "Vedtak 20.11.2025",
        ]);

        await expect(page.getByRole("list", { name: "Strøm" })).toHaveCount(0);
        await expect(
            page.getByText(
                "Denne saken er under behandling. Når saken er ferdigbehandlet og du har fått et vedtak, vil det vises her."
            )
        ).toBeVisible();
        await expect(
            page.getByText("Saken din vil bli behandlet, men vi kan ikke vise status for søknaden din på nav.no.")
        ).toBeVisible();
        await expect(page.getByRole("link", { name: "ta kontakt med Nav-kontoret ditt" })).toHaveAttribute(
            "href",
            "https://www.nav.no/sok-nav-kontor"
        );
    });
});
