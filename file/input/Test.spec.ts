import { test } from "@playwright/test";

// Source
import * as helperSrc from "../../src/HelperSrc.js";

test("01", async ({ page }) => {
    await page.goto(helperSrc.URL_TEST);

    await page.waitForLoadState("domcontentloaded");

    // Your test here
    //...
    // Your test here

    await page.waitForTimeout(1000);
    await page.close();
});
