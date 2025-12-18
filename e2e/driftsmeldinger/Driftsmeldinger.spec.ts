import { expect, test } from "@playwright/test";

import { createMswHelper } from "../helpers/msw-helpers";
import { Driftsmelding } from "../../src/components/driftsmelding/getDriftsmeldinger";

test.describe("Driftsmeldinger on Landingsside", () => {
    test("should not render driftsmeldinger when there are none", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEmptyState();

        await page.goto("/sosialhjelp/innsyn/nb");
        await page.getByRole("button", { name: "Nei" }).click();
        await expect(page.getByTestId(/driftsmelding/)).not.toBeVisible();
    });

    test("should render driftsmeldinger when there are some", async ({ page, request, baseURL }) => {
        const msw = createMswHelper(request, baseURL!);
        await msw.mockEmptySaker();
        await msw.mockEmptyUtbetalinger();
        await msw.mockEndpoint("/driftsmeldinger/api/status?audience=innsyn", [
            {
                severity: "warning",
                id: 1,
                text: "Dette er en test",
                createdAt: new Date().toISOString(),
                visibleInInnsyn: true,
                visibleInSoknad: true,
                visibleInModia: false,
            } satisfies Driftsmelding,
            {
                severity: "warning",
                id: 2,
                text: "Dette er en annen test",
                createdAt: new Date().toISOString(),
                visibleInInnsyn: true,
                visibleInSoknad: true,
                visibleInModia: false,
            } satisfies Driftsmelding,
        ]);

        await page.goto("/sosialhjelp/innsyn/nb");
        await page.getByRole("button", { name: "Nei" }).click();
        await expect(page.getByTestId("driftsmelding-1")).toBeVisible();
        await expect(page.getByTestId("driftsmelding-2")).toBeVisible();
        await expect(page.getByText(/Dette er en test/)).toBeVisible();
        await expect(page.getByText(/Dette er en annen test/)).toBeVisible();
    });
});
