import { test } from "@playwright/test";

// Only "A-Za-z0-9-" are allowed in the test name.
test("Test-1", async ({ page }) => {
    // Change only the url
    await page.goto("https://google.com");

    await page.waitForLoadState("networkidle");

    // Your test here
    await page.getByText("Gmail").click();
    await page.locator(".feature__chapter__button .laptop-desktop-only").click();
    await page.locator("#firstName").click();
    await page.locator("#firstName").fill("test");
    await page.locator("#lastName").click();
    await page.locator("#lastName").fill("test");
    await page.locator("#username").click();
    await page.locator("#username").fill("test");
    await page.locator("[name=Passwd]").click();
    await page.locator("[name=Passwd]").fill("test");
    await page.locator("[name=ConfirmPasswd]").click();
    await page.locator("[name=ConfirmPasswd]").fill("test");
    await page.locator(".VfPpkd-muHVFf-bMcfAe").click({ force: true });
    await page.locator(".FliLIb.DL0QTb").click();
    // Your test here

    await page.waitForTimeout(1000);
    await page.close();
});
