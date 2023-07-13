import { test } from "@playwright/test";

test("Test 1", async ({ page }) => {
    // Change only the url
    await page.goto("https://wikipedia.org");

    await page.waitForLoadState("networkidle");

    // Your test here
    await page.locator("#searchInput").click();
    await page.locator("#searchInput").fill("e=mc2");
    await page.locator(".pure-button.pure-button-primary-progressive").click({ force: true });
    // Your test here

    await page.waitForTimeout(1000);
    await page.close();
});
