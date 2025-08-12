import path from "path";

import { test, expect } from "@playwright/test";

test("Should be able to upload file", async ({ page }) => {
    await page.goto("/sosialhjelp/innsyn/nb/landingsside");
    const link = page.getByRole("link", { name: "Søknad om økonomisk sosialhjelp" });
    link.first().click();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByText("Velg filer").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "image.png"));
    await expect(page.getByText("image.png").first()).toBeVisible();
    await page.getByRole("button", { name: "Send dokumentasjon" }).click();

    // Check that the file is listed in the uploaded files
    await expect(page.getByText(/Dokumentasjonen din ble sendt inn/)).toBeVisible();
    await expect(page.getByRole("link", { name: "image.png" }).first()).toBeVisible();
});
