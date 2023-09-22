/* eslint-disable @typescript-eslint/no-unsafe-call */
import Express from "express";
import { exec } from "child_process";
import Fs from "fs";
import { SioClient } from "@cimo/websocket";

// Source
import * as ControllerHelper from "../controller/Helper";
import * as ControllerUpload from "../controller/Upload";
import * as ModelTester from "../model/Tester";

export const execute = (app: Express.Express) => {
    SioClient.execute(`${ControllerHelper.DOMAIN}:1002`, {});

    SioClient.o<ModelTester.Iresponse>("run", (data) => {
        if ((data.stdout !== "" && data.stderr === "") || (data.stdout !== "" && data.stderr !== "")) {
            // ok
        } else if (data.stdout === "" && data.stderr !== "") {
            ControllerHelper.writeLog("Tester.ts - exec(`npx playwright test ... - stderr: ", data.stderr);
        }
    });

    app.post("/msautomatetest/upload", (request: Express.Request, response: Express.Response) => {
        void (async () => {
            await ControllerUpload.execute(request, false)
                .then((resultList) => {
                    let fileName = "";

                    for (const value of resultList) {
                        if (value.name === "file" && value.filename) {
                            fileName = value.filename;
                        }
                    }

                    ControllerHelper.responseBody(fileName, "", response, 200);
                })
                .catch((error: Error) => {
                    ControllerHelper.writeLog("Tester.ts - ControllerUpload.execute() - catch error: ", ControllerHelper.objectOutput(error));

                    ControllerHelper.responseBody("", error, response, 500);
                });
        })();
    });

    app.post("/msautomatetest/run", (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        const checkToken = ControllerHelper.checkToken(requestBody.token_api);
        const name = requestBody.name;
        const browser = requestBody.browser.match("^(desktop_chrome|desktop_edge|desktop_firefox|desktop_safari|mobile_android|mobile_ios)$")
            ? requestBody.browser
            : "";

        if (checkToken) {
            exec(`npx playwright test "${name}" --config=./src/playwright.config.ts --project=${browser}`, (error, stdout, stderr) => {
                SioClient.i("run", { stdout: stdout, stderr: stderr });
            });

            ControllerHelper.responseBody("", "", response, 200);
        } else {
            ControllerHelper.writeLog("Tester.ts - /msautomatetest/run - tokenWrong: ", requestBody.token_api);

            ControllerHelper.responseBody("", `tokenWrong: ${requestBody.token_api}`, response, 500);
        }
    });

    app.post("/msautomatetest/download", (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        const checkToken = ControllerHelper.checkToken(requestBody.token_api);
        const name = requestBody.name ? requestBody.name.replace(/[ _]/g, "-").replace(/[()]/g, "") : "";

        if (checkToken) {
            exec(`find file/output/evidence/*${name}* -name "*video*"`, (error, stdout, stderr) => {
                if ((stdout !== "" && stderr === "") || (stdout !== "" && stderr !== "")) {
                    const filePath = stdout.replace("\n", "");

                    response.download(`./${filePath}`, `${name}.webm`);
                } else if (stdout === "" && stderr !== "") {
                    ControllerHelper.writeLog("Tester.ts - exec(`find file/output/... - stderr: ", stderr);

                    ControllerHelper.responseBody("", stderr, response, 500);
                }
            });
        } else {
            ControllerHelper.writeLog("Tester.ts - /msautomatetest/download - tokenWrong: ", requestBody.token_api);

            ControllerHelper.responseBody("", `tokenWrong: ${requestBody.token_api}`, response, 500);
        }
    });
};

export const testList = () => {
    const list = Fs.readdirSync(ControllerHelper.PATH_FILE_INPUT);

    return list;
};
