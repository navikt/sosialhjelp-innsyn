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

        // Check that both vedtak are displayed
        const newestVedtakLink = page.getByRole("link", { name: /Åpne vedtaksbrev \(nytt\)/i });
        const olderVedtakLink = page.getByRole("link", { name: /^Åpne vedtaksbrev(?! \(nytt\))/i });

        await expect(newestVedtakLink).toBeVisible();
        await expect(olderVedtakLink).toBeVisible();

        // Verify the newest vedtak appears before the older one in the DOM
        const allVedtakLinks = page.getByRole("link", { name: /Åpne vedtaksbrev/ });
        const links = await allVedtakLinks.all();
        expect(links.length).toBe(2);

        // The first link should be the newest one (with "nytt" label)
        await expect(links[0]).toContainText(/nytt/i);
        await expect(links[1]).not.toContainText(/nytt/i);
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
        const vedtakSection = page.getByRole("heading", { name: "Vedtak", level: 2 });
        await expect(vedtakSection).toBeVisible();

        // The title should be in the same section, and the status tag should show the latest decision
        const sakTitle = page.getByRole("heading", { name: /Sak med flere vedtak/i, level: 3 });
        await expect(sakTitle).toBeVisible();

        // Check that the "Avslag" status tag is visible near the title
        // The StatusTag component renders the status, so we look for the text
        const statusTag = page.getByText("Avslag").first();
        await expect(statusTag).toBeVisible();
    });

    test("should show only one vedtak without 'nytt' label when there is a single vedtak", async ({
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

        // Should show the vedtak link without "nytt" label
        const vedtakLink = page.getByRole("link", { name: /^Åpne vedtaksbrev(?! \(nytt\))/i });
        await expect(vedtakLink).toBeVisible();

        // Should not show the "nytt" label
        const nyttVedtakLink = page.getByRole("link", { name: /Åpne vedtaksbrev \(nytt\)/i });
        await expect(nyttVedtakLink).not.toBeVisible();
    });

    test("should display three vedtak correctly sorted with only the newest marked as new", async ({
        page,
        request,
        baseURL,
    }) => {
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
            dato: "2025-11-25",
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

        // Get all vedtak links
        const allVedtakLinks = page.getByRole("link", { name: /Åpne vedtaksbrev/ });
        const links = await allVedtakLinks.all();
        expect(links.length).toBe(3);

        // Only the first link should have "nytt" label
        await expect(links[0]).toContainText(/nytt/i);
        await expect(links[1]).not.toContainText(/nytt/i);
        await expect(links[2]).not.toContainText(/nytt/i);

        // Verify the status tag shows the latest decision (AVSLATT)
        const statusTag = page.getByText("Avslag").first();
        await expect(statusTag).toBeVisible();
    });
});
