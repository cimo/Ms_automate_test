import { defineConfig, devices } from "@playwright/test";

// Source
import * as helperSrc from "./HelperSrc";

export default defineConfig({
    testDir: `${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_INPUT}`,
    outputDir: `${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_OUTPUT}artifact`,
    fullyParallel: false,
    reporter: "line",
    reportSlowTests: null,
    timeout: 20 * 60 * 1000,
    expect: {
        timeout: 15 * 60 * 1000
    },
    use: {
        actionTimeout: 60000,
        testIdAttribute: "data-at_id",
        ignoreHTTPSErrors: true,
        video: "on",
        launchOptions: {
            slowMo: 1500
        }
    },
    projects: [
        {
            name: "desktop_chrome",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1920, height: 1080 },
                channel: "chrome"
            }
        },
        {
            name: "desktop_edge",
            use: {
                ...devices["Desktop Edge"],
                viewport: { width: 1920, height: 1080 },
                channel: "msedge"
            }
        },
        {
            name: "desktop_firefox",
            use: {
                ...devices["Desktop firefox"],
                viewport: { width: 1920, height: 1080 }
            }
        },
        {
            name: "desktop_safari",
            use: {
                ...devices["Desktop safari"],
                viewport: { width: 1920, height: 1080 }
            }
        },
        {
            name: "mobile_android",
            use: { ...devices["Pixel 5"] }
        },
        {
            name: "mobile_ios",
            use: { ...devices["iPhone 12"] }
        }
    ]
});
