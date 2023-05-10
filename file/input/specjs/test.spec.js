/* eslint-disable no-undef */
const { Browser, Builder, By } = require("selenium-webdriver");
const Chrome = require("selenium-webdriver/chrome");
//const Edge = require("selenium-webdriver/edge");
const Fs = require("fs");

const ChromeOptionList = new Chrome.Options();
//const EdgeOptionList = new Edge.Options();

describe("Test suite", function () {
    this.timeout(30000);
    let driver;

    beforeEach(async function () {
        ChromeOptionList.addArguments("--no-sandbox");
        ChromeOptionList.addArguments("--ignore-certificate-errors");
        ChromeOptionList.addArguments("--disable-dev-shm-usage");
        ChromeOptionList.addArguments("--window-size=1920,1080");
        driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(ChromeOptionList).build();

        //EdgeOptionList.addArguments("--no-sandbox");
        //EdgeOptionList.addArguments("--ignore-certificate-errors");
        //EdgeOptionList.addArguments("--disable-dev-shm-usage");
        //EdgeOptionList.addArguments("--window-size=1920,1080");
        //driver = await new Builder().forBrowser(Browser.EDGE).setEdgeOptions(EdgeOptionList).build();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it("test_1", async function () {
        // Insert here the test exported from selenium ide
        await driver.get("https://google.com");
        await driver.findElement(By.linkText("Gmail")).click();
        await driver.findElement(By.css(".feature__chapter__button .laptop-desktop-only")).click();
        await driver.findElement(By.id("firstName")).sendKeys("test");
        await driver.findElement(By.id("lastName")).click();
        await driver.findElement(By.id("lastName")).sendKeys("test");
        await driver.findElement(By.id("username")).click();
        await driver.findElement(By.id("username")).sendKeys("test");
        await driver.findElement(By.name("Passwd")).click();
        await driver.findElement(By.name("Passwd")).sendKeys("test");
        await driver.findElement(By.name("ConfirmPasswd")).click();
        await driver.findElement(By.name("ConfirmPasswd")).sendKeys("test");
        await driver.findElement(By.css(".VfPpkd-muHVFf-bMcfAe")).click();
        // Insert here the test exported from selenium ide

        await driver.takeScreenshot().then(function (image) {
            Fs.writeFileSync("/home/root/file/output/test_1.png", image, "base64");
        });
    });
});
