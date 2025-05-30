import { test } from "@playwright/test";
import * as HelperSrc from "../../src/HelperSrc";

test("01", async ({ page }) => {
    await page.goto(HelperSrc.URL_TEST);

    await page.waitForLoadState("domcontentloaded");

    // Your test here
    //...
    // Your test here

    await page.waitForTimeout(1000);
    await page.close();
});
