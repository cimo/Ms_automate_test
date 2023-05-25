import { test } from "@playwright/test";

test("Test 1", async ({ page }) => {
    await page.goto("https://devtest.kit.kpmg.co.jp/cms/signIn");
    await page.waitForLoadState("networkidle");

    await page.locator("[name=username]").click();
    await page.locator("[name=username]").fill("superuser@jp.kpmg.com");
    await page.locator("[name=password]").click();
    await page.locator("[name=password]").fill("test");
    await page.locator(".MuiFormControl-root:nth-child(3) .MuiButton-label").click();
    await page.locator(".MuiButtonBase-root:nth-child(2) > .MuiButton-label").click();
    await page.locator(".MuiIconButton-colorInherit:nth-child(1) .MuiSvgIcon-root").click();
    await page.locator(".labelLogout").click();
    await page.locator(".content > img").waitFor();

    await page.close();
});
