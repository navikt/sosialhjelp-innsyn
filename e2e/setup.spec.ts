import { test } from "@playwright/test";
import { createMswHelper } from "./helpers/msw-helpers";

test("Remove cookie banner and save storage state of cookie", async ({ page, request, baseURL }) => {
    const msw = createMswHelper(request, baseURL!);
    await msw.mockEmptyState();
    await page.goto("/sosialhjelp/innsyn");

    const neiButton = page.getByRole("button", { name: "Nei" });
    if (await neiButton.isVisible()) {
        await neiButton.click();
        await page.context().storageState({ path: "e2e/.auth/storage.json" });
    }
});
