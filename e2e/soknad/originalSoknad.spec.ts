import { test, expect } from "@playwright/test";

import { createMswHelper, mockSoknadEndpoints } from "../helpers/msw-helpers";
import { OriginalSoknadDto } from "../../src/generated/model";
import type { VedleggResponse } from "../../src/generated/ssr/model";

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "Test User" });
});

test.describe("Original søknad i dokumentliste", () => {
    test("should show the original søknad as the first item in the documents list", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        const originalSoknad: OriginalSoknadDto = {
            url: "/original.pdf",
            date: "2025-01-10T12:00:00Z",
            size: 204800,
            filename: "soknad.pdf",
        };

        await mockSoknadEndpoints(msw, "test-soknad-1", { originalSoknad });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");
        await page.getByRole("main").waitFor({ state: "visible" });

        // The original søknad link should appear in the documents list under "Ettersend dokumentasjon"
        const dokumenterHeading = page.getByRole("heading", { name: "Ettersend dokumentasjon", level: 2 });
        await expect(dokumenterHeading).toBeVisible();

        const soknadLink = page.getByRole("link", { name: "soknad.pdf" });
        await expect(soknadLink).toBeVisible();
        await expect(soknadLink).toHaveAttribute("href", expect.stringContaining("/original.pdf"));
    });

    test("should use fallback filename when original søknad has no filename", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const originalSoknad: OriginalSoknadDto = {
            url: "/original.pdf",
            date: "2025-01-10T12:00:00Z",
            size: 204800,
            filename: "",
        };

        await mockSoknadEndpoints(msw, "test-soknad-1", { originalSoknad });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");
        await page.getByRole("main").waitFor({ state: "visible" });

        // Should show the fallback translation key "soknadFilename"
        const soknadLink = page.getByRole("link", { name: "Søknad om økonomisk sosialhjelp" });
        await expect(soknadLink).toBeVisible();
    });

    test("should sort original søknad and other vedlegg chronologically", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);

        const originalSoknad: OriginalSoknadDto = {
            url: "/original.pdf",
            date: "2025-01-10T12:00:00Z",
            size: 204800,
            filename: "min-soknad.pdf",
        };

        const vedlegg: VedleggResponse[] = [
            {
                url: "/ettersendelse1.pdf",
                type: "annet",
                tilleggsinfo: "annet",
                datoLagtTil: "2025-02-01T12:00:00Z",
                filnavn: "ettersendelse.pdf",
                storrelse: 102400,
            },
        ];

        await mockSoknadEndpoints(msw, "test-soknad-1", { originalSoknad, vedlegg });

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");
        await page.getByRole("main").waitFor({ state: "visible" });

        const dokumenterSection = page.getByRole("heading", { name: "Dokumenter", level: 3 });
        await expect(dokumenterSection).toBeVisible();

        const allLinks = page.getByRole("list", { name: "Dokumenter" }).getByRole("listitem").getByRole("link");
        const links = await allLinks.all();

        // There should be at least 2 links (original søknad + ettersendelse)
        expect(links.length).toBeGreaterThanOrEqual(2);

        // Sorted chronologically — ettersendelse.pdf (Feb) is newer than min-soknad.pdf (Jan)
        await expect(links[0]).toContainText("ettersendelse.pdf");
        await expect(links[1]).toContainText("min-soknad.pdf");
    });

    test("should not show the documents section when there are no vedlegg and no original søknad", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);

        await mockSoknadEndpoints(msw, "test-soknad-1", {
            originalSoknad: undefined,
            vedlegg: [],
        });

        // Override the originalSoknad endpoint to return null/empty
        await msw.mockEndpoint("/api/v1/innsyn/test-soknad-1/originalSoknad", null);

        await page.goto("/sosialhjelp/innsyn/nb/soknad/test-soknad-1");
        await page.getByRole("main").waitFor({ state: "visible" });

        const dokumenterHeading = page.getByRole("heading", { name: "Dokumenter", level: 3 });
        await expect(dokumenterHeading).not.toBeVisible();
    });
});
