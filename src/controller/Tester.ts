import Express from "express";
import Fs from "fs";
import { exec } from "child_process";
import { CwsServer } from "@cimo/websocket";
import { Cp } from "@cimo/pid";

// Source
import * as ControllerHelper from "./Helper";
import * as ControllerUpload from "./Upload";
import * as ModelHelper from "../model/Helper";
import * as ModelTester from "../model/Tester";

let cwsServer: CwsServer;

export const specList = () => {
    return Fs.readdirSync(ControllerHelper.PATH_FILE_INPUT);
};

export const api = (app: Express.Express, CaAuthenticationMiddleware: Express.RequestHandler, cp: Cp) => {
    app.post("/api/run", CaAuthenticationMiddleware, (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        actionRun(cp, requestBody.name, requestBody.browser, requestBody.action_number)
            .then((data) => {
                ControllerHelper.responseBody(data.stdout, data.stderr, response, 200);
            })
            .catch((error: Error) => {
                ControllerHelper.writeLog("Tester.ts - app.post('/api/run') - actionRun() - catch()", error);

                ControllerHelper.responseBody("", error, response, 200);
            });
    });

    app.post("/api/download", CaAuthenticationMiddleware, (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        const nameReplace = typeof requestBody.name === "string" ? requestBody.name.replace(/[ ]/g, "_").replace(/[()]/g, "").toLowerCase() : "";
        const actionNumber = typeof requestBody.action_number === "string" ? requestBody.action_number : "";

        if (nameReplace !== "" && actionNumber !== "") {
            cp.add("api", (pidIndex) => {
                if (pidIndex > 0) {
                    cwsServer.sendInputBroadcast(null, "action", { name: "side", number: actionNumber, status: "start" });

                    exec(`find ${ControllerHelper.PATH_FILE_OUTPUT}evidence/*${nameReplace}* -name "*video*"`, (error, stdout, stderr) => {
                        cp.remove(pidIndex);

                        const result = stdout.replace(ControllerHelper.PATH_FILE_OUTPUT, "").trim();

                        ControllerHelper.responseBody(result, stderr, response, 200);

                        cwsServer.sendInputBroadcast(null, "action", { name: "side", number: actionNumber, status: "end" });
                    });
                } else {
                    ControllerHelper.responseBody("", "Another action still running.", response, 200);
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
                    ControllerHelper.writeLog("Tester.ts - app.post('/api/upload') - catch()", error);

                    ControllerHelper.responseBody("", error, response, 200);
                });
        })();
    });
};

export const websocket = (cwsServerValue: CwsServer, cp: Cp) => {
    cwsServer = cwsServerValue;

    cwsServer.receiveOutput("api_run", (socket, data) => {
        const message = data.message as unknown as ModelTester.Irequest;

        actionRun(cp, message.name, message.browser, message.action_number)
            .then((data) => {
                cwsServer.sendInput(socket, "api_run", { stdout: data.stdout, stderr: data.stderr });
            })
            .catch((error: Error) => {
                ControllerHelper.writeLog("Tester.ts - receiveOutput('api_run') - actionRun() - catch()", error);

                cwsServer.sendInput(socket, "api_run", error.toString());
            });
    });
};

const actionRun = (cp: Cp, nameValue: string, browserValue: string, actionNumberValue: string): Promise<ModelHelper.IresponseExec> => {
    return new Promise((resolve) => {
        const nameCheck = typeof nameValue === "string" ? nameValue : "";
        const browserMatch =
            typeof browserValue === "string" &&
            browserValue.match("^(desktop_chrome|desktop_edge|desktop_firefox|desktop_safari|mobile_android|mobile_ios)$")
                ? browserValue
                : "";
        const actionNumber = typeof actionNumberValue === "string" ? actionNumberValue : "";

        if (nameCheck !== "" && browserMatch !== "" && actionNumber !== "") {
            cp.add("api", (pidIndex) => {
                if (pidIndex > 0) {
                    cwsServer.sendInputBroadcast(null, "action", { name: "list", number: actionNumber, status: "start" });

                    exec(
                        `npx playwright test "${nameValue}" --config=./src/playwright.config.ts --project=${browserMatch}`,
                        (_error, stdout, stderr) => {
                            cp.remove(pidIndex);

                            const result = stdout.replace("[1A[2K", "").replace("[1A[2K", "");

                            cwsServer.sendInputBroadcast(null, "action", { name: "list", number: actionNumber, status: "end" });

                            resolve({ stdout: result, stderr });
                        }
                    );
                } else {
                    resolve({ stdout: "", stderr: "Another action still running." });
                }
            });
        } else {
            resolve({ stdout: "", stderr: "Wrong parameters." });
        }
    });
};
