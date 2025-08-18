import Fs from "fs";
import { execFile, spawn } from "child_process";
import { Cp } from "@cimo/pid/dist/src/Main";
import { CwsServer } from "@cimo/websocket/dist/src/Main";

// Source
import * as helperSrc from "../HelperSrc";
import * as modelTester from "../model/Tester";

export default class Tester {
    // Variable
    private cp: Cp;
    private cwsServer: CwsServer;

    private outputList: modelTester.Ioutput[];
    private pidKey: number;
    private processRunPid: number | null;

    // Method
    private user = (): void => {
        this.cwsServer.receiveData("user", () => {
            const clientList: string[] = Array.from(this.cwsServer.getClientMap().keys());

            const serverDataObject: modelTester.IserverDataBroadcast = { tag: "user", status: "", result: clientList };
            this.cwsServer.sendDataBroadcast(serverDataObject);
        });
    };

    private specFile = (): void => {
        this.cwsServer.receiveData("spec_file", () => {
            const fileList = Fs.readdirSync(`${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_INPUT}`);

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

            const serverDataObject: modelTester.IserverDataBroadcast = { tag: "spec_file", status: "", result: resultList };
            this.cwsServer.sendDataBroadcast(serverDataObject);
        });
    };

    private output = (): void => {
        this.cwsServer.receiveData("output", () => {
            const serverDataObject: modelTester.IserverDataBroadcast = { tag: "output", status: "", result: this.outputList };
            this.cwsServer.sendDataBroadcast(serverDataObject);
        });
    };

    private run = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataRun>("run", (clientId, message) => {
            const browserCheck = message.browser.match("^(desktop_chrome|desktop_edge|desktop_firefox|desktop_safari|mobile_android|mobile_ios)$")
                ? message.browser
                : "";

            const serverDataBroadcastObject = {} as modelTester.IserverDataBroadcast;
            const serverDataObject = {} as modelTester.IserverData;

            if (message.index >= 0 && message.specFileName !== "" && browserCheck !== "") {
                serverDataBroadcastObject.tag = "output";

                this.cp.add("run", JSON.stringify(serverDataBroadcastObject), 0, (pidIsRunning, pidKey) => {
                    if (!pidIsRunning) {
                        this.pidKey = pidKey;

                        this.outputList[message.index] = {
                            browser: message.browser,
                            phase: "running",
                            time: helperSrc.serverTime(),
                            log: ""
                        };

                        serverDataBroadcastObject.result = this.outputList;
                        this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                        this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                        const execCommand1 = `. ${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_SCRIPT}command1.sh`;
                        const execArgumentList1 = [`"${message.specFileName}"`, `"${browserCheck}"`];

                        const processRun = execFile(
                            execCommand1,
                            execArgumentList1,
                            { shell: "/bin/bash", encoding: "utf8" },
                            (_, stdout1, stderr1) => {
                                if (stderr1 !== "") {
                                    helperSrc.writeLog("Tester.ts - run() - execFile()", `stderr1: ${stderr1}`);

                                    const status = "error";

                                    this.outputList[message.index] = {
                                        browser: message.browser,
                                        phase: status,
                                        time: helperSrc.serverTime(),
                                        log: helperSrc.removeAnsiEscape(stderr1)
                                    };

                                    serverDataBroadcastObject.result = this.outputList;
                                    this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                                    this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                                    serverDataObject.status = status;
                                    serverDataObject.result = "System error, check the log for more info.";
                                    this.cwsServer.sendData(clientId, "text", serverDataObject, "run");

                                    this.cp.remove(this.pidKey);

                                    this.pidKey = 0;
                                } else {
                                    const execCommand2 = `. ${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_SCRIPT}command2.sh`;
                                    const execArgumentList2 = [
                                        `"${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_OUTPUT}artifact"`,
                                        `"${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}"`
                                    ];

                                    execFile(execCommand2, execArgumentList2, { shell: "/bin/bash", encoding: "utf8" }, () => {
                                        const status = /Error:|interrupted|not run/.test(stdout1) ? "error" : "success";

                                        this.outputList[message.index] = {
                                            browser: message.browser,
                                            phase: status,
                                            time: helperSrc.serverTime(),
                                            log: helperSrc.removeAnsiEscape(stdout1)
                                        };

                                        serverDataBroadcastObject.result = this.outputList;
                                        this.cwsServer.sendDataBroadcast(serverDataBroadcastObject);

                                        this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcastObject));

                                        serverDataObject.status = status;
                                        serverDataObject.result = "Test completed, check the log for more info.";
                                        this.cwsServer.sendData(clientId, "text", serverDataObject, "run");

                                        this.cp.remove(this.pidKey);

                                        this.pidKey = 0;
                                    });
                                }
                            }
                        );

                        if (processRun && processRun.pid) {
                            const spawnCommand = spawn("pgrep", ["-P", processRun.pid.toString()]);

                            spawnCommand.stdout.on("data", (data: string) => {
                                this.processRunPid = parseInt(data);
                            });
                        }
                    } else {
                        serverDataObject.status = "error";
                        serverDataObject.result = "Another process still running.";
                        this.cwsServer.sendData(clientId, "text", serverDataObject, "run");
                    }
                });
            } else {
                serverDataObject.status = "error";
                serverDataObject.result = "Wrong parameter.";
                this.cwsServer.sendData(clientId, "text", serverDataObject, "run");
            }
        });
    };

    private stop = (): void => {
        this.cwsServer.receiveData("stop", () => {
            if (this.processRunPid) {
                process.kill(this.processRunPid, "SIGINT");

                this.cp.remove(this.pidKey);

                this.pidKey = 0;
            }
        });
    };

    private log = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataLog>("log_run", (clientId, message) => {
            const serverData: modelTester.IserverData = { status: "Log run", result: this.outputList[message.index].log };
            this.cwsServer.sendData(clientId, "text", serverData, "log_run");
        });
    };

    private video = (): void => {
        this.cwsServer.receiveData<modelTester.IclientDataVideo>("video", (clientId, message) => {
            const serverData = {} as modelTester.IserverData;

            if (message.name !== "") {
                const execCommand = `. ${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_SCRIPT}command3.sh`;
                const execArgumentList = [`"${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}"`, `"${message.name}"`];

                execFile(execCommand, execArgumentList, { shell: "/bin/bash", encoding: "utf8" }, (_, stdout) => {
                    if (!stdout) {
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

                    this.cwsServer.sendData(clientId, "text", serverData, "video");
                });
            } else {
                serverData.status = "error";
                serverData.result = "Wrong parameter.";
                this.cwsServer.sendData(clientId, "text", serverData, "video");
            }
        });

        this.cwsServer.receiveData<modelTester.IclientDataVideo>("video_delete", (clientId, message) => {
            const serverData = {} as modelTester.IserverData;

            if (message.name !== "") {
                const execCommand = `. ${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_SCRIPT}command4.sh`;
                const execArgumentList = [`"${helperSrc.PATH_ROOT}${helperSrc.PATH_PUBLIC}"`, `"${message.name}"`];

                execFile(execCommand, execArgumentList, { shell: "/bin/bash", encoding: "utf8" }, () => {
                    serverData.status = "success";
                    serverData.result = "File deleted.";
                    this.cwsServer.sendData(clientId, "text", serverData, "video_delete");
                });
            } else {
                serverData.status = "error";
                serverData.result = "Wrong parameter.";
                this.cwsServer.sendData(clientId, "text", serverData, "video_delete");
            }
        });
    };

    private upload = (): void => {
        this.cwsServer.receiveDataUpload((clientId, data, filename) => {
            Fs.writeFileSync(`${helperSrc.PATH_ROOT}${helperSrc.PATH_FILE_INPUT}${filename}`, Buffer.concat(data));

            const serverData: modelTester.IserverData = { status: "success", result: "Upload completed." };
            this.cwsServer.sendData(clientId, "text", serverData, "upload");
        });
    };

    constructor(cp: Cp, cwsServer: CwsServer) {
        this.cp = cp;
        this.cwsServer = cwsServer;

        this.outputList = [];
        this.pidKey = 0;
        this.processRunPid = null;
    }

    websocket = (): void => {
        this.user();

        this.specFile();

        this.output();

        this.run();

        this.stop();

        this.log();

        this.video();

        this.upload();
    };
}
