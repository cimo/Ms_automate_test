import Express from "express";
import { exec } from "child_process";
import Path from "path";

// Source
import * as ControllerHelper from "../Controller/Helper";
import * as ControllerUpload from "../Controller/Upload";
import * as ModelTester from "../Model/Tester";

export const execute = (app: Express.Express) => {
    app.post("/msautomatetest/upload", (request: Express.Request, response: Express.Response) => {
        void (async () => {
            await ControllerUpload.execute(request)
                .then((result) => {
                    const input = result;
                    const fileExtension = Path.parse(result).ext;
                    const folder = fileExtension === ".side" ? "side/" : "specjs";
                    const fileName = Path.parse(result).name;

                    exec(`mv ${input} ${ControllerHelper.PATH_FILE_INPUT}${folder}${fileName}`, (error, stdout, stderr) => {
                        if (stdout !== "" && stderr === "") {
                            ControllerHelper.responseBody(stdout, "", response, 200);
                        } else if (stdout === "" && stderr !== "") {
                            ControllerHelper.writeLog("Tester.ts - exec(`mv ... - stderr: ", stderr);

                            ControllerHelper.responseBody("", stderr, response, 500);
                        } else {
                            ControllerHelper.responseBody(stdout, stderr, response, 200);
                        }
                    });
                })
                .catch((error: Error) => {
                    ControllerHelper.writeLog("Tester.ts - /msautomatetest/upload - catch error: ", ControllerHelper.objectOutput(error));

                    ControllerHelper.responseBody("", error, response, 500);
                });
        })();
    });

    app.post("/msautomatetest/run", (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelTester.Irequest;

        const checkToken = ControllerHelper.checkToken(requestBody.token_api);
        const browser = requestBody.browser;
        const mode = requestBody.mode;
        const name = requestBody.name;

        if (checkToken) {
            let browserOption = "";

            if (browser === "chrome") {
                browserOption = `goog:chromeOptions.args=[--no-sandbox, --ignore-certificate-errors, --disable-dev-shm-usage, --start-maximized] browserName=chrome`;
            } else if (browser === "edge") {
                browserOption = `ms:edgeOptions.args=[--no-sandbox, --ignore-certificate-errors, --disable-dev-shm-usage, --start-maximized] browserName=MicrosoftEdge`;
            }

            let command = "";
            const windowWidth = "1920";
            const windowHeight = "1080";

            if (mode === "side") {
                command = `xvfb-run -a --server-args="-screen 0, ${windowWidth}x${windowHeight}x24 -dpi 96" npx selenium-side-runner -c "${browserOption}" "${ControllerHelper.PATH_FILE_INPUT}${mode}/*.side"`;
            } else if (mode === "specjs") {
                command = `xvfb-run -a --server-args="-screen 0, ${windowWidth}x${windowHeight}x24 -dpi 96" npx mocha "${ControllerHelper.PATH_FILE_INPUT}${mode}/${name}.spec.js"`;
            }

            exec(command, (error, stdout, stderr) => {
                if (stdout !== "" && stderr === "") {
                    ControllerHelper.responseBody(stdout, "", response, 200);
                } else if (stdout === "" && stderr !== "") {
                    ControllerHelper.writeLog("Tester.ts - exec(`xvfb-run ... - stderr: ", stderr);

                    ControllerHelper.responseBody("", stderr, response, 500);
                } else {
                    ControllerHelper.responseBody(stdout, stderr, response, 200);
                }
            });
        } else {
            ControllerHelper.writeLog("Tester.ts - /msautomatetest/run - tokenWrong: ", requestBody.token_api);

            ControllerHelper.responseBody("", `tokenWrong: ${requestBody.token_api}`, response, 500);
        }
    });
};
