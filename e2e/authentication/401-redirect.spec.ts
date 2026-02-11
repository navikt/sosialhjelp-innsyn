import { test, expect } from "@playwright/test";
import { createMswHelper } from "../helpers/msw-helpers";

test.describe("Unauthorized handling", () => {
    test("should redirect to /oauth2/login when API returns 401", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.reset();

        await request.post(`${baseURL}/api/test/msw`, {
            data: {
                endpoint: "/api/v1/innsyn/saker",
                statusCode: 401,
            },
        });

        await page.goto("/sosialhjelp/innsyn");

        // Wait for redirect to login page
        await page.waitForURL(/\/oauth2\/login/, { timeout: 5000 });

        expect(page.url()).toContain("/oauth2/login");
    });

    test("should show tilgangsside when person doesnt have tilgang (is adressebeskyttet)", async ({
        page,
        request,
        baseURL,
    }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.reset();

        await request.post(`${baseURL}/api/test/msw`, {
            data: {
                endpoint: "/api/v1/innsyn/tilgang",
                response: {
                    harTilgang: false,
                },
            },
        });

        await page.goto("/sosialhjelp/innsyn");

        await expect(
            page.getByText(/Du kan dessverre ikke bruke den digitale søknaden om økonomisk sosialhjelp/i)
        ).toBeVisible();
    });

    test.afterEach(async ({ request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.reset();
    });
});
