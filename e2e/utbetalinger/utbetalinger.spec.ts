import { test, expect } from "@playwright/test";

test.describe("Utbetalinger - Snarveier", () => {
    test("should navigate to Soknader page when Soknader snarvei is clicked", async ({ page }) => {
        await page.goto("/sosialhjelp/innsyn/nb/utbetaling");
        const mineSoknaderLink = page.getByRole("link", { name: "Mine søknader" });
        await expect(mineSoknaderLink).toBeVisible();

        await mineSoknaderLink.click();

        await expect(page).toHaveURL(/\/soknader/);
    });
});
