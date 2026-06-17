import Fs from "fs";
import Express, { Request, Response } from "express";
import { RateLimitRequestHandler } from "express-rate-limit";
import { ChildProcess, spawn } from "child_process";
import { Cp } from "@cimo/pid/dist/src/Main.js";
import { CwsServer } from "@cimo/websocket/dist/src/Main.js";
import { Ca } from "@cimo/authentication/dist/src/Main.js";

// Source
import * as helperSrc from "../HelperSrc.js";
import * as modelTester from "../model/Tester.js";

export default class Tester {
    // Variable
    private cp: Cp;
    private cwsServer: CwsServer;

    private app: Express.Express;
    private limiter: RateLimitRequestHandler;

    private outputList: modelTester.Ioutput[];
    private pidKey: number;
    private processRun1: ChildProcess | undefined;
    private processRun2: ChildProcess | undefined;
    private isStopRequested: boolean;

    // Method
    private processKill = (processRun: ChildProcess): void => {
        this.isStopRequested = true;

        if (!processRun.pid || processRun.pid <= 0) {
            return;
        }

        const killScript = `
            kill_tree() {
                local parameter1="$1"
                local childrenList
                childrenList="$(pgrep -P "$parameter1" || true)"
                for children in $childrenList
                do
                    kill_tree "$children"
                done
                kill -KILL "$parameter1" 2>/dev/null || true
            }
            kill_tree "${processRun.pid}"
        `;

        const killer = spawn("/bin/bash", ["-lc", killScript], { detached: true, stdio: "ignore" });

        killer.on("error", (error: Error) => {
            helperSrc.writeLog("Tester.ts - processKill() - spawn() - Error", error.message);
        });

        killer.unref();
    };

    private client = (): void => {
        this.cwsServer.receiveData("client", () => {
            const serverDataObject: modelTester.IserverDataBroadcast = { label: "client", status: "", result: this.cwsServer.clientIdList() };
            this.cwsServer.sendDataBroadcast(serverDataObject);
        });
    };

    private specFile = (): void => {
        this.cwsServer.receiveData("spec_file", () => {
            helperSrc.findInDirectoryRecursive(`${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}input/`, ".spec.ts").then((pathFileList) => {
                const finalList: string[] = [];

                for (let a = 0; a < pathFileList.length; a++) {
                    const fileDetail = helperSrc.fileDetail(pathFileList[a], undefined, false);

                    finalList.push(fileDetail.fileName.replace(/\.spec\.ts$/, ""));
                }

                const serverDataObject: modelTester.IserverDataBroadcast = { label: "spec_file", status: "", result: finalList };
                this.cwsServer.sendDataBroadcast(serverDataObject);
            });
        });
    };

    private output = (): void => {
        this.cwsServer.receiveData("output", () => {
            const serverDataObject: modelTester.IserverDataBroadcast = { label: "output", status: "", result: this.outputList };
            this.cwsServer.sendDataBroadcast(serverDataObject);
        });
    };

    private run = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataRun>("run", (data, clientId) => {
            const browserCheck = data.browser.match("^(desktop_chrome|desktop_edge|desktop_firefox|desktop_safari|mobile_android|mobile_ios)$")
                ? data.browser
                : "";

            const serverDataBroadcastObject = {} as modelTester.IserverDataBroadcast;
            const serverDataObject = {} as modelTester.IserverData;

            if (data.index >= 0 && data.specFileName !== "" && browserCheck !== "") {
                serverDataBroadcastObject.label = "output";

                this.cp.add("run", JSON.stringify(serverDataBroadcastObject), 0, (pidIsRunning, pidKey) => {
                    if (!pidIsRunning) {
                        this.pidKey = pidKey;

                        this.isStopRequested = false;

                        this.outputList[data.index] = {
                            browser: data.browser,
                            phase: "running",
                            time: helperSrc.localeFormat(new Date()) as string,
                            log: ""
                        };

                        serverDataBroadcastObject.result = this.outputList;
                        this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                        this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                        const execCommand1 = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command1.sh`;
                        const execArgumentList1 = [execCommand1, data.specFileName, browserCheck];

                        const execution1 = helperSrc.executionFile(execArgumentList1);
                        this.processRun1 = execution1.process;

                        execution1.then((result1) => {
                            const error1 = result1.error;
                            const stdout1 = result1.stdout;
                            const stderr1 = result1.stderr;

                            if (this.isStopRequested) {
                                this.processRun1 = undefined;
                                this.isStopRequested = false;

                                return;
                            }

                            if (error1 || stderr1 !== "") {
                                let log = "";

                                if (error1) {
                                    helperSrc.writeLog(`Tester.ts - run() - executionFile(1) - error`, error1.message);

                                    log = error1.message;
                                } else if (stderr1 !== "") {
                                    helperSrc.writeLog("Tester.ts - run() - executionFile(1) - stderr", stderr1);

                                    log = stderr1;
                                }

                                const status = "error";

                                this.outputList[data.index] = {
                                    browser: data.browser,
                                    phase: status,
                                    time: helperSrc.localeFormat(new Date()) as string,
                                    log: helperSrc.ansiEscapeDelete(log)
                                };

                                serverDataBroadcastObject.result = this.outputList;
                                this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                                this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                                serverDataObject.status = status;
                                serverDataObject.result = "System error, check the log for more info.";
                                this.cwsServer.sendMessage("text", serverDataObject, "run", clientId);

                                this.cp.delete(this.pidKey);

                                this.pidKey = 0;

                                this.processRun1 = undefined;
                            } else {
                                this.processRun1 = undefined;

                                const execCommand2 = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command2.sh`;
                                const execArgumentList2 = [
                                    execCommand2,
                                    `${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}output/artifact/`,
                                    `${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}`
                                ];

                                const execution2 = helperSrc.executionFile(execArgumentList2);
                                this.processRun2 = execution2.process;

                                execution2.then((result2) => {
                                    const error2 = result2.error;

                                    if (this.isStopRequested) {
                                        this.processRun2 = undefined;
                                        this.isStopRequested = false;

                                        return;
                                    }

                                    let log = "";

                                    if (error2) {
                                        helperSrc.writeLog(`Tester.ts - run() - executionFile(2) - error`, error2.message);

                                        log = error2.message;
                                    } else {
                                        log = stdout1;
                                    }

                                    const status = /Error:|interrupted|not run/.test(stdout1) ? "error" : "success";

                                    this.outputList[data.index] = {
                                        browser: data.browser,
                                        phase: status,
                                        time: helperSrc.localeFormat(new Date()) as string,
                                        log: helperSrc.ansiEscapeDelete(log)
                                    };

                                    serverDataBroadcastObject.result = this.outputList;
                                    this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                                    this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                                    serverDataObject.status = status;
                                    serverDataObject.result = "Test completed, check the log for more info.";
                                    this.cwsServer.sendMessage("text", serverDataObject, "run", clientId);

                                    this.cp.delete(this.pidKey);

                                    this.pidKey = 0;

                                    this.processRun2 = undefined;
                                });
                            }
                        });
                    } else {
                        serverDataObject.status = "error";
                        serverDataObject.result = "Another process still running.";
                        this.cwsServer.sendMessage("text", serverDataObject, "run", clientId);
                    }
                });
            } else {
                serverDataObject.status = "error";
                serverDataObject.result = "Wrong parameter.";
                this.cwsServer.sendMessage("text", serverDataObject, "run", clientId);
            }
        });
    };

    private stop = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataStop>("stop", (data) => {
            if (this.processRun1) {
                this.processKill(this.processRun1);

                this.processRun1 = undefined;
            }

            if (this.processRun2) {
                this.processKill(this.processRun2);

                this.processRun2 = undefined;
            }

            const serverDataBroadcastObject = {} as modelTester.IserverDataBroadcast;

            if (data.index >= 0 && this.outputList[data.index]) {
                this.outputList[data.index] = {
                    ...this.outputList[data.index],
                    phase: "error",
                    time: helperSrc.localeFormat(new Date()) as string,
                    log: "Interrupted by user."
                };

                serverDataBroadcastObject.label = "output";
                serverDataBroadcastObject.result = this.outputList;
                this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);
            }

            if (this.pidKey > 0) {
                this.cp.delete(this.pidKey);

                this.pidKey = 0;
            }
        });
    };

    private log = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataLog>("log_run", (data, clientId) => {
            const serverData: modelTester.IserverData = { status: "Log run", result: this.outputList[data.index].log };
            this.cwsServer.sendMessage("text", serverData, "log_run", clientId);
        });
    };

    private video = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataVideo>("video", (data, clientId) => {
            const serverData = {} as modelTester.IserverData;

            if (data.name !== "") {
                const execCommand = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command3.sh`;
                const execArgumentList = [execCommand, `${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}`, data.name];

                helperSrc.executionFile(execArgumentList).then((result) => {
                    if (result.error) {
                        helperSrc.writeLog(`Tester.ts - video() - receiveData(video) - executionFile() - error`, result.error.message);

                        serverData.status = "error";
                        serverData.result = result.error.message;
                    } else if (result.stdout === "") {
                        serverData.status = "error";
                        serverData.result = "File not found.";
                    } else {
                        serverData.status = "success";

                        const stdoutSplit = result.stdout.trim().split("\n");
                        const nameList = [];

                        for (let a = 0; a < stdoutSplit.length; a++) {
                            nameList.push(stdoutSplit[a]);
                        }

                        nameList.sort((a, b) => a.localeCompare(b));

                        serverData.result = nameList;
                    }

                    this.cwsServer.sendMessage("text", serverData, "video", clientId);
                });
            } else {
                serverData.status = "error";
                serverData.result = "Wrong parameter.";
                this.cwsServer.sendMessage("text", serverData, "video", clientId);
            }
        });

        this.cwsServer.receiveData<modelTester.IclientDataVideo>("video_delete", (data, clientId) => {
            const serverData = {} as modelTester.IserverData;

            if (data.name !== "") {
                const execCommand = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command4.sh`;
                const execArgumentList = [execCommand, `${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}`, data.name];

                helperSrc.executionFile(execArgumentList).then((result) => {
                    if (result.error) {
                        helperSrc.writeLog(`Tester.ts - video() - receiveData(video_delete) - executionFile() - error`, result.error.message);

                        serverData.status = "error";
                        serverData.result = result.error.message;
                    } else if (result.stdout === "") {
                        serverData.status = "success";
                        serverData.result = "File deleted.";
                    }

                    this.cwsServer.sendMessage("text", serverData, "video_delete", clientId);
                });
            } else {
                serverData.status = "error";
                serverData.result = "Wrong parameter.";
                this.cwsServer.sendMessage("text", serverData, "video_delete", clientId);
            }
        });
    };

    private upload = (): void => {
        this.cwsServer.receiveDataUpload((data, mimeType, fileName, clientId) => {
            const file = Buffer.concat(data);

            const isMimeTypeOk = helperSrc.fileCheckMimeType(mimeType);
            const isSizeOk = helperSrc.fileCheckSize(file.length);

            let serverData = {} as modelTester.IserverData;

            if (!isMimeTypeOk) {
                serverData = { status: "error", result: "Only .ts file are allowed." };
                this.cwsServer.sendMessage("text", serverData, "upload", clientId);

                return;
            }

            if (!isSizeOk) {
                serverData = { status: "error", result: `File limit is: ${helperSrc.FILE_SIZE_MB} MB.` };
                this.cwsServer.sendMessage("text", serverData, "upload", clientId);

                return;
            }

            Fs.writeFile(`${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}input/${fileName}`, file, (error) => {
                if (error) {
                    helperSrc.writeLog("Tester.ts - upload() - writeFile() - Error", error.message);

                    serverData = { status: "error", result: "Upload failed." };
                } else {
                    serverData = { status: "success", result: "Upload completed." };
                }

                this.cwsServer.sendMessage("text", serverData, "upload", clientId);
            });
        });
    };

    constructor(cp: Cp, cwsServer: CwsServer, app: Express.Express, limiter: RateLimitRequestHandler) {
        this.cp = cp;
        this.cwsServer = cwsServer;

        this.app = app;
        this.limiter = limiter;

        this.outputList = [];
        this.pidKey = 0;
        this.processRun1 = undefined;
        this.processRun2 = undefined;
        this.isStopRequested = false;
    }

    websocket = (): void => {
        this.client();

        this.specFile();

        this.output();

        this.run();

        this.stop();

        this.log();

        this.video();

        this.upload();
    };

    api = (): void => {
        this.app.get("/api/list-test", this.limiter, Ca.authenticationMiddleware, (_, response: Response) => {
            const nameList: string[] = [];

            helperSrc.findInDirectoryRecursive(`${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}input/`, ".spec.ts").then((pathFileList) => {
                for (let a = 0; a < pathFileList.length; a++) {
                    const fileDetail = helperSrc.fileDetail(pathFileList[a], undefined, false);

                    nameList.push(fileDetail.fileName);
                }

                helperSrc.responseBody(JSON.stringify({ action: "listTest", nameList: nameList }), "", response, 200);
            });
        });

        this.app.post("/api/run", this.limiter, Ca.authenticationMiddleware, (request: Request, response: Response) => {
            const body = request.body as modelTester.IapiRunBody;

            const file = body.file.replace(/\.spec\.ts$/, "");
            const browser = body.browser;

            const execCommand1 = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command1.sh`;
            const execArgumentList1 = [execCommand1, file, browser];

            helperSrc.executionFile(execArgumentList1).then((result1) => {
                const error1 = result1.error;
                const stdout = result1.stdout;
                const stderr = result1.stderr;

                if (error1) {
                    helperSrc.writeLog("Tester.ts - api() - run - executionFile(1) - error", error1.message);

                    helperSrc.responseBody("", error1.message, response, 500);

                    return;
                }

                if ((stdout !== "" && stderr === "") || (stdout !== "" && stderr !== "")) {
                    const execCommand2 = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command2.sh`;
                    const execArgumentList2 = [
                        execCommand2,
                        `${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}output/artifact/`,
                        `${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}`
                    ];

                    helperSrc.executionFile(execArgumentList2).then((result2) => {
                        const error2 = result2.error;

                        if (error2) {
                            helperSrc.writeLog("Tester.ts - api() - run - executionFile(2) - error", error2.message);

                            helperSrc.responseBody("", error2.message, response, 500);

                            return;
                        }

                        helperSrc.responseBody(JSON.stringify({ action: "run", stdout: helperSrc.ansiEscapeDelete(stdout) }), "", response, 200);
                    });
                } else if (stdout === "" && stderr !== "") {
                    helperSrc.writeLog("Tester.ts - api() - run - executionFile(1) - stderr", stderr);

                    helperSrc.responseBody("", stderr, response, 500);
                }
            });
        });

        this.app.post("/api/list-video", this.limiter, Ca.authenticationMiddleware, (request: Request, response: Response) => {
            const nameList: string[] = [];

            const body = request.body as modelTester.IapiListVideoBody;

            const video = body.video;

            const execCommand = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command3.sh`;
            const execArgumentList = [execCommand, `${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}`, video];

            helperSrc.executionFile(execArgumentList).then((result) => {
                if (result.error) {
                    helperSrc.writeLog("Tester.ts - api() - list-video - executionFile() - error", result.error.message);

                    helperSrc.responseBody("", "ko", response, 500);

                    return;
                }

                const stdoutSplit = result.stdout.trim().split("\n");

                for (let a = 0; a < stdoutSplit.length; a++) {
                    if (stdoutSplit[a].toLowerCase().includes(video.toLowerCase())) {
                        nameList.push(stdoutSplit[a]);
                    }
                }

                const nameListSorted = nameList.sort((a, b) => {
                    return a.localeCompare(b);
                });

                helperSrc.responseBody(JSON.stringify({ action: "listVideo", nameList: nameListSorted }), "", response, 200);
            });
        });
    };
}
