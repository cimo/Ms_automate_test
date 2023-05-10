import Express from "express";
import { exec } from "child_process";
import Path from "path";

// Source
import * as ControllerHelper from "../Controller/Helper";
import * as ControllerUpload from "../Controller/Upload";
import * as ModelHelper from "../Model/Helper";

export const execute = (app: Express.Express) => {
    app.post("/msautomatetest/upload", (request: Express.Request, response: Express.Response) => {
        void (async () => {
            await ControllerUpload.execute(request)
                .then((result) => {
                    const fileName = Path.basename(result.response.stdout);
                    const fileExtension = Path.extname(result.response.stdout);
                    const folder = fileExtension === ".side" ? "side/" : "specjs";

                    exec(
                        `mv ${ControllerHelper.PATH_FILE_INPUT}${fileName} ${ControllerHelper.PATH_FILE_INPUT}${folder}${fileName}`,
                        (error, stdout, stderr) => {
                            if (stdout !== "" && stderr === "") {
                                response.status(200).send({ response: { stdout, stderr } });
                            } else if (stdout === "" && stderr !== "") {
                                ControllerHelper.writeLog("Tester.ts - exec(`mv ... - stderr: ", stderr);

                                response.status(500).send({ response: { stdout, stderr } });
                            } else {
                                response.status(200).send({ response: { stdout, stderr } });
                            }
                        }
                    );
                })
                .catch((result: ModelHelper.IresponseExecute) => {
                    ControllerHelper.writeLog("Tester.ts - /msautomatetest/upload - stderr: ", result.response.stderr);

                    response.status(500).send({
                        stdout: result.response.stdout,
                        stderr: result.response.stderr
                    });
                });
        })();
    });

    app.post("/msautomatetest/run", (request: Express.Request, response: Express.Response) => {
        const requestBody = request.body as ModelHelper.IrequestBody;

        const checkToken = ControllerHelper.checkToken(requestBody.token_api);
        const browser = requestBody.browser;
        const mode = requestBody.mode;

        if (checkToken) {
            let browserOption = "";
            let command = "";

            const windowWidth = "1920";
            const windowHeight = "1080";

            if (browser === "chrome") {
                browserOption = `goog:chromeOptions.args=[--no-sandbox, --ignore-certificate-errors, --disable-dev-shm-usage, --window-size=${windowWidth},${windowHeight}] browserName=chrome`;
            } else if (browser === "edge") {
                browserOption = `browserName=edge`;
            }

            if (mode === "side") {
                command = `xvfb-run -a --server-args="-screen 0, ${windowWidth}x${windowHeight}x24 -dpi 96" npx selenium-side-runner -c "${browserOption}" ${ControllerHelper.PATH_FILE_INPUT}${mode}/*.side`;
            } else if (mode === "specjs") {
                command = `xvfb-run -a --server-args="-screen 0, ${windowWidth}x${windowHeight}x24 -dpi 96" npx mocha ${ControllerHelper.PATH_FILE_INPUT}${mode}/*.spec.js`;
            }

            exec(command, (error, stdout, stderr) => {
                if (stdout !== "" && stderr === "") {
                    response.status(200).send({ response: { stdout, stderr } });
                } else if (stdout === "" && stderr !== "") {
                    ControllerHelper.writeLog("Tester.ts - exec(`xvfb-run ... - stderr: ", stderr);

                    response.status(500).send({ response: { stdout, stderr } });
                } else {
                    response.status(200).send({ response: { stdout, stderr } });
                }
            });
        } else {
            ControllerHelper.writeLog("Tester.ts - /msautomatetest/run - tokenWrong: ", requestBody.token_api);

            response.status(500).send({
                stdout: "",
                stderr: `tokenWrong: ${requestBody.token_api}`
            });
        }
    });
};
