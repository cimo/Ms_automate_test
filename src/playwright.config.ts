import { defineConfig, devices } from "@playwright/test";

// Source
import * as ControllerHelper from "./controller/Helper";

export default defineConfig({
    testDir: ControllerHelper.PATH_FILE_INPUT,
    outputDir: `${ControllerHelper.PATH_FILE_OUTPUT}/evidence/`,
    fullyParallel: false,
    reporter: "line",
    use: {
        ignoreHTTPSErrors: true,
        video: "on"
    },
    projects: [
        {
            name: "desktop_chrome",
            use: {
                ...devices["Desktop Chrome"],
                channel: "chrome"
            }
        },
        {
            name: "desktop_edge",
            use: {
                ...devices["Desktop Edge"],
                channel: "msedge"
            }
        },
        {
            name: "desktop_firefox",
            use: { ...devices["Desktop firefox"] }
        },
        {
            name: "desktop_safari",
            use: { ...devices["Desktop safari"] }
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
