import Express from "express";
import Fs from "fs";
import { exec } from "child_process";
import { CwsServer } from "@cimo/websocket";

// Source
import * as ControllerHelper from "../controller/Helper";
import * as ControllerUpload from "../controller/Upload";
import * as ModelTester from "../model/Tester";

let cwsServer: CwsServer;

export const api = (app: Express.Express, CaAuthenticationMiddleware: Express.RequestHandler) => {
    app.post("/api/run", CaAuthenticationMiddleware, (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        const nameCheck = typeof requestBody.name === "string" ? requestBody.name : "";
        const browserMatch =
            typeof requestBody.browser === "string" &&
            requestBody.browser.match("^(desktop_chrome|desktop_edge|desktop_firefox|desktop_safari|mobile_android|mobile_ios)$")
                ? requestBody.browser
                : "";
        const processNumber = typeof requestBody.process_number === "string" ? requestBody.process_number : "";

        if (nameCheck !== "" && browserMatch !== "" && processNumber !== "") {
            ControllerHelper.startPid("api", (isExecuted) => {
                if (isExecuted) {
                    cwsServer.sendInputBroadcast(null, "process", { name: "list", number: processNumber, status: "start" });

                    exec(
                        `npx playwright test "${requestBody.name}" --config=./src/playwright.config.ts --project=${browserMatch}`,
                        (_error, stdout, stderr) => {
                            const result = stdout.replace("[1A[2K", "").replace("[1A[2K", "");

                            ControllerHelper.responseBody(result, stderr, response, 200);

                            ControllerHelper.endPid("api");

                            cwsServer.sendInputBroadcast(null, "process", { name: "list", number: processNumber, status: "end" });
                        }
                    );
                } else {
                    ControllerHelper.responseBody("", "Another process still running.", response, 200);
                }
            });
        } else {
            ControllerHelper.responseBody("", "Wrong parameters.", response, 200);
        }
    });

    app.post("/api/download", CaAuthenticationMiddleware, (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        const nameReplace = typeof requestBody.name === "string" ? requestBody.name.replace(/[ ]/g, "_").replace(/[()]/g, "").toLowerCase() : "";
        const processNumber = typeof requestBody.process_number === "string" ? requestBody.process_number : "";

        if (nameReplace !== "" && processNumber !== "") {
            ControllerHelper.startPid("api", (isExecuted) => {
                if (isExecuted) {
                    cwsServer.sendInputBroadcast(null, "process", { name: "side", number: processNumber, status: "start" });

                    exec(`find ${ControllerHelper.PATH_FILE_OUTPUT}evidence/*${nameReplace}* -name "*video*"`, (error, stdout, stderr) => {
                        const result = stdout.replace(ControllerHelper.PATH_FILE_OUTPUT, "").trim();

                        ControllerHelper.responseBody(result, stderr, response, 200);

                        ControllerHelper.endPid("api");

                        cwsServer.sendInputBroadcast(null, "process", { name: "side", number: processNumber, status: "end" });
                    });
                } else {
                    ControllerHelper.responseBody("", "Another process still running.", response, 200);
                }
            });
        } else {
            ControllerHelper.responseBody("", "Wrong parameter.", response, 200);
        }
    });

    app.post("/api/upload", CaAuthenticationMiddleware, (request: Express.Request, response: Express.Response) => {
        void (async () => {
            await ControllerUpload.execute(request, true)
                .then((resultList) => {
                    let fileName = "";

                    for (const value of resultList) {
                        if (value.name === "file" && value.filename) {
                            fileName = value.filename;

                            break;
                        }
                    }

                    ControllerHelper.responseBody(fileName, "", response, 200);
                })
                .catch((error: Error) => {
                    ControllerHelper.writeLog("Tester.ts - /upload - ControllerUpload.execute() - catch()", error);

                    ControllerHelper.responseBody("", error, response, 200);
                });
        })();
    });
};

export const specList = () => {
    return Fs.readdirSync(ControllerHelper.PATH_FILE_INPUT);
};

export const websocket = (cwsServerValue: CwsServer) => {
    cwsServer = cwsServerValue;
};
