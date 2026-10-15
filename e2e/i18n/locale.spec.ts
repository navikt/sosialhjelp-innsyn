import { expect, test } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";
import { SakResponse } from "../../src/generated/model";

test.beforeEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEmptyState();
    await msw.mockEndpoint("/api/v1/innsyn/tilgang", { harTilgang: true, fornavn: "whatever" });
});

test.afterEach(async ({ request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.reset();
});

test("uses the decorator language cookie without adding it to the URL", async ({ page, baseURL }) => {
    await page.context().addCookies([
        {
            name: "decorator-language",
            value: "en",
            url: baseURL,
        },
    ]);

    await page.goto("/");

    await expect(page).toHaveURL(/\/sosialhjelp\/innsyn\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { name: "Financial assistance" })).toBeVisible();
});

test("keeps complaint text when changing language", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    const mockSakData: SakResponse = {
        tittel: "Søknad om økonomisk sosialhjelp",
        vedtaksdato: "2025-11-20",
        vedtaksBrev: { id: "vedtak-pdf-ref", url: "/vedtak.pdf" },
        navEnhetNavn: "NAV Oslo",
    };
    await msw.mockEndpoint("/api/v1/innsyn/test-id-1/sak/vedtak-1", mockSakData);
    await page.context().addCookies([
        {
            name: "decorator-language",
            value: "nb",
            url: baseURL,
        },
    ]);

    await page.goto("/klage/opprett/test-id-1/vedtak-1");
    const textarea = page.getByRole("textbox", { name: "Hvorfor er du uenig?" });
    await textarea.fill("Jeg er uenig i vedtaket.");
    await page.context().addCookies([
        {
            name: "decorator-language",
            value: "en",
            url: baseURL,
        },
    ]);
    await page.evaluate(() => {
        window.postMessage(
            {
                source: "decorator",
                event: "languageSelect",
                payload: { locale: "en", handleInApp: true },
            },
            window.location.origin
        );
    });

    await expect(page).toHaveURL(/\/klage\/opprett\/test-id-1\/vedtak-1$/);
    await expect(page.getByRole("textbox", { name: "Why do you disagree?" })).toHaveValue("Jeg er uenig i vedtaket.");
});
