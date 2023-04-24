import Express from "express";
//import Path from "path";
import { exec } from "child_process";

// Source
import * as ControllerHelper from "../Controller/Helper";

export const execute = (app: Express.Express): void => {
    app.post("/msautomatetest/execute", (request: Express.Request, response: Express.Response) => {
        // eslint-disable-next-line @typescript-eslint/require-await
        void (async () => {
            const input = `${ControllerHelper.PATH_FILE_INPUT}Test.side`;
            exec(
                `selenium-side-runner -c "browserName=chrome goog:chromeOptions.args=[--headless, --no-sandbox, --disable-extensions, --whitelisted-ips=]" ${input}`,
                (error, stdout, stderr) => {
                    if (stdout !== "" && stderr === "") {
                        ControllerHelper.writeLog("Tester.ts - exec('selenium-side-runner... - stdout", stdout);

                        response.status(200).send({ Response: stdout });
                    } else if (stdout === "" && stderr !== "") {
                        ControllerHelper.writeLog("Tester.ts - exec('selenium-side-runner... - stderr", stderr);

                        response.status(500).send({ Error: stderr });
                    } else {
                        ControllerHelper.writeLog(
                            "Tester.ts - exec('selenium-side-runner... - stdout & stderr",
                            ControllerHelper.objectOutput({ stdout, stderr })
                        );

                        response.status(200).send({ Response: stdout, Error: stderr });
                    }
                }
            );
        })();
    });
};
