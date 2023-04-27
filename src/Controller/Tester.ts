import Express from "express";
import { exec } from "child_process";

// Source
import * as ControllerHelper from "../Controller/Helper";
import * as ControllerUpload from "../Controller/Upload";
import * as ModelHelper from "../Model/Helper";

const run = (): Promise<ModelHelper.IresponseExecute> => {
    return new Promise((resolve, reject) => {
        const input = `${ControllerHelper.PATH_FILE_INPUT}*.side`;

        //acceptInsecureCerts=true
        exec(
            `xvfb-run --server-args="-screen 0, 1920x1080x24" selenium-side-runner -c "browserName=chrome goog:chromeOptions.args=[--no-sandbox, --ignore-certificate-errors, --disable-dev-shm-usage, --window-size=1920,1080]" ${input}`,
            (error, stdout, stderr) => {
                if (stdout !== "" && stderr === "") {
                    ControllerHelper.writeLog("Tester.ts - 'run = ()' - stdout", stdout);

                    resolve({ response: { stdout, stderr } });
                } else if (stdout === "" && stderr !== "") {
                    ControllerHelper.writeLog("Tester.ts - 'run = ()' - stderr", stderr);

                    reject({ response: { stdout, stderr } });
                } else {
                    ControllerHelper.writeLog("Tester.ts - 'run = ()' - stdout & stderr", ControllerHelper.objectOutput({ stdout, stderr }));

                    resolve({ response: { stdout, stderr } });
                }
            }
        );
    });
};

export const execute = (app: Express.Express): void => {
    app.post("/msautomatetest/upload", (request: Express.Request, response: Express.Response) => {
        void (async () => {
            await ControllerUpload.execute(request)
                .then((result) => {
                    const input = result.response.stdout;

                    ControllerHelper.writeLog("Tester.ts - '/msautomatetest/upload'", input);

                    response.status(200).send({ stdout: result.response.stdout, stderr: result.response.stderr });
                })
                .catch((result: ModelHelper.IresponseExecute) => {
                    ControllerHelper.writeLog("Tester.ts - '/msautomatetest/upload'", "Upload failed.");

                    response.status(500).send({ stdout: result.response.stdout, stderr: result.response.stderr });
                });
        })();
    });

    app.post("/msautomatetest/run", (request: Express.Request, response: Express.Response) => {
        void (async () => {
            await run()
                .then((result) => {
                    response.status(200).send({ stdout: result.response.stdout, stderr: result.response.stderr });
                })
                .catch((result: ModelHelper.IresponseExecute) => {
                    response.status(500).send({ stdout: result.response.stdout, stderr: result.response.stderr });
                });
        })();
    });
};
