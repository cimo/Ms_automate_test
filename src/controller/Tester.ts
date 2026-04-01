import Fs from "fs";
import { ChildProcess, execFile, spawn } from "child_process";
import { Cp } from "@cimo/pid/dist/src/Main.js";
import { CwsServer } from "@cimo/websocket/dist/src/Main.js";

// Source
import * as helperSrc from "../HelperSrc.js";
import * as modelTester from "../model/Tester.js";

export default class Tester {
    // Variable
    private cp: Cp;
    private cwsServer: CwsServer;

    private outputList: modelTester.Ioutput[];
    private pidKey: number;
    private processRun1: ChildProcess | null;
    private processRun2: ChildProcess | null;
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
            Fs.readdir(`${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}input/`, (error, fileList) => {
                if (error) {
                    helperSrc.writeLog("Tester.ts - specFile() - receiveData() - readdir() - Error", error.message);

                    const serverDataObject: modelTester.IserverDataBroadcast = { label: "spec_file", status: "", result: [] };
                    this.cwsServer.sendDataBroadcast(serverDataObject);

                    return;
                }

                const fileFilteredList: string[] = [];

                for (let a = 0; a < fileList.length; a++) {
                    if (fileList[a].endsWith(".spec.ts")) {
                        fileFilteredList.push(fileList[a]);
                    }
                }

                const resultList: string[] = [];

                for (let a = 0; a < fileFilteredList.length; a++) {
                    resultList.push(fileFilteredList[a].replace(/\.spec\.ts$/, ""));
                }

                const serverDataObject: modelTester.IserverDataBroadcast = { label: "spec_file", status: "", result: resultList };
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

                        this.processRun1 = execFile("/bin/bash", execArgumentList1, { encoding: "utf8" }, (error1, stdout1, stderr1) => {
                            if (this.isStopRequested) {
                                this.processRun1 = null;
                                this.isStopRequested = false;

                                return;
                            }

                            if (error1 || stderr1 !== "") {
                                let log = "";

                                if (error1) {
                                    helperSrc.writeLog(`Tester.ts - run() - execFile(1) - error`, error1.message);

                                    log = error1.message;
                                } else if (stderr1 !== "") {
                                    helperSrc.writeLog("Tester.ts - run() - execFile(1) - stderr", stderr1);

                                    log = stderr1;
                                }

                                const status = "error";

                                this.outputList[data.index] = {
                                    browser: data.browser,
                                    phase: status,
                                    time: helperSrc.localeFormat(new Date()) as string,
                                    log: helperSrc.deleteAnsiEscape(log)
                                };

                                serverDataBroadcastObject.result = this.outputList;
                                this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                                this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                                serverDataObject.status = status;
                                serverDataObject.result = "System error, check the log for more info.";
                                this.cwsServer.sendMessage("text", serverDataObject, "run", clientId);

                                this.cp.delete(this.pidKey);

                                this.pidKey = 0;

                                this.processRun1 = null;
                            } else {
                                this.processRun1 = null;

                                const execCommand2 = `${helperSrc.PATH_ROOT}${helperSrc.PATH_SCRIPT}command2.sh`;
                                const execArgumentList2 = [
                                    execCommand2,
                                    `${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE}output/artifact/`,
                                    `${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}`
                                ];

                                this.processRun2 = execFile("/bin/bash", execArgumentList2, { encoding: "utf8" }, (error2) => {
                                    if (this.isStopRequested) {
                                        this.processRun2 = null;
                                        this.isStopRequested = false;

                                        return;
                                    }

                                    let log = "";

                                    if (error2) {
                                        helperSrc.writeLog(`Tester.ts - run() - execFile(2) - error`, error2.message);

                                        log = error2.message;
                                    } else {
                                        log = stdout1;
                                    }

                                    const status = /Error:|interrupted|not run/.test(stdout1) ? "error" : "success";

                                    this.outputList[data.index] = {
                                        browser: data.browser,
                                        phase: status,
                                        time: helperSrc.localeFormat(new Date()) as string,
                                        log: helperSrc.deleteAnsiEscape(log)
                                    };

                                    serverDataBroadcastObject.result = this.outputList;
                                    this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                                    this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                                    serverDataObject.status = status;
                                    serverDataObject.result = "Test completed, check the log for more info.";
                                    this.cwsServer.sendMessage("text", serverDataObject, "run", clientId);

                                    this.cp.delete(this.pidKey);

                                    this.pidKey = 0;

                                    this.processRun2 = null;
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

                this.processRun1 = null;
            }

            if (this.processRun2) {
                this.processKill(this.processRun2);

                this.processRun2 = null;
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

                execFile("/bin/bash", execArgumentList, { encoding: "utf8" }, (error, stdout) => {
                    if (error) {
                        helperSrc.writeLog(`Tester.ts - video() - error`, error.message);

                        serverData.status = "error";
                        serverData.result = error.message;
                    } else if (stdout === "") {
                        serverData.status = "error";
                        serverData.result = "File not found.";
                    } else {
                        serverData.status = "success";

                        const stdoutSplit = stdout.trim().split("\n");
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

                execFile("/bin/bash", execArgumentList, { encoding: "utf8" }, (error, stdout) => {
                    if (error) {
                        helperSrc.writeLog(`Tester.ts - video() - error`, error.message);

                        serverData.status = "error";
                        serverData.result = error.message;
                    } else if (stdout === "") {
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

    constructor(cp: Cp, cwsServer: CwsServer) {
        this.cp = cp;
        this.cwsServer = cwsServer;

        this.outputList = [];
        this.pidKey = 0;
        this.processRun1 = null;
        this.processRun2 = null;
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
}
