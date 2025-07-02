import { test, expect } from "@playwright/test";

test("should render snarveier", async ({ page }) => {
    await page.goto("/nb/landingsside");
    await expect(page.getByRole("heading", { name: "Snarveier" })).toBeVisible();
});

test("should not render snarveier when no soknader, klager or utbetalinger", async ({ page }) => {
    await page.goto("/nb/landingsside");
    // Lager og logger på en ny bruker for å unngå at det finnes soknader, klager eller utbetalinger
    await page.getByRole("button", { name: "Opprett bruker" }).click();
    await page.getByRole("button", { name: "Opprett bruker og logg inn" }).click({ force: true });
});
