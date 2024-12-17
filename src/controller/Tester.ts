import Fs from "fs";
import { execFile, spawn } from "child_process";
import { Cp } from "@cimo/pid";
import { CwsServer } from "@cimo/websocket";

// Source
import * as HelperSrc from "../HelperSrc";
import * as ModelTester from "../model/Tester";

export default class ControllerTester {
    // Variable
    private cp: Cp;
    private cwsServer: CwsServer;

    private pidKey: number;
    private resultOutput: ModelTester.IserverDataOutput[];
    private processRunPid: number | null;

    // Method
    constructor(cp: Cp, cwsServer: CwsServer) {
        this.cp = cp;
        this.cwsServer = cwsServer;

        this.pidKey = 0;
        this.resultOutput = [];
        this.processRunPid = null;
    }

    websocket = (): void => {
        this.specFileList();

        this.user();

        this.output();

        this.run();

        this.runLog();

        this.stop();

        this.video();

        this.upload();
    };

    private specFileList = (): void => {
        this.cwsServer.receiveData("specFileList", (clientId) => {
            const fileList = Fs.readdirSync(`${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_INPUT}`);

            const fileFiltered: string[] = [];
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].endsWith(".spec.ts")) {
                    fileFiltered.push(fileList[i]);
                }
            }

            const resultList: string[] = [];
            for (let i = 0; i < fileFiltered.length; i++) {
                resultList.push(fileFiltered[i].replace(/\.spec\.ts$/, ""));
            }

            const serverData: ModelTester.IserverData = { status: "", result: resultList };
            this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "specFileList");
        });
    };

    private user = (): void => {
        this.cwsServer.receiveData("user", () => {
            const keyList: string[] = Array.from(this.cwsServer.getClientList().keys());

            const serverData: ModelTester.IserverDataBroadcast = { status: "", result: keyList, tag: "user" };
            this.cwsServer.sendDataBroadcast(JSON.stringify(serverData));
        });
    };

    private output = (): void => {
        this.cwsServer.receiveData("output", () => {
            const serverData: ModelTester.IserverDataBroadcast = { status: "", result: this.resultOutput, tag: "output" };
            this.cwsServer.sendDataBroadcast(JSON.stringify(serverData));
        });
    };

    private run = (): void => {
        this.cwsServer.receiveData("run", (clientId, data) => {
            if (typeof data === "string") {
                const clientData = JSON.parse(data) as ModelTester.IclientDataRun;

                const browserCheck = clientData.browser.match(
                    "^(desktop_chrome|desktop_edge|desktop_firefox|desktop_safari|mobile_android|mobile_ios)$"
                )
                    ? clientData.browser
                    : "";

                const serverDataBroadcast = {} as ModelTester.IserverDataBroadcast;
                const serverData = {} as ModelTester.IserverDataRun;

                if (clientData.index >= 0 && clientData.name !== "" && browserCheck !== "") {
                    serverDataBroadcast.tag = "output";

                    this.cp.add("run", JSON.stringify(serverDataBroadcast), 0, (isExists, pidKey) => {
                        if (!isExists) {
                            this.pidKey = pidKey;

                            this.resultOutput[clientData.index] = {
                                state: "running",
                                browser: clientData.browser,
                                time: HelperSrc.serverTime(),
                                log: ""
                            };

                            serverDataBroadcast.result = this.resultOutput;
                            this.cwsServer.sendDataBroadcast(JSON.stringify(serverDataBroadcast));

                            this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcast));

                            const execCommand1 = `. ${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_SCRIPT}command1.sh`;
                            const execArgumentList1 = [`"${clientData.name}"`, `"${browserCheck}"`];

                            const processRun = execFile(
                                execCommand1,
                                execArgumentList1,
                                { shell: "/bin/bash", encoding: "utf8" },
                                (_, stdout1, stderr1) => {
                                    if (stderr1 !== "") {
                                        HelperSrc.writeLog("Tester.ts => run() => execFile()", `stderr1: ${stderr1}`);

                                        const status = "error";

                                        this.resultOutput[clientData.index] = {
                                            state: status,
                                            browser: clientData.browser,
                                            time: HelperSrc.serverTime(),
                                            log: HelperSrc.removeAnsiEscape(stderr1)
                                        };

                                        serverDataBroadcast.result = this.resultOutput;
                                        this.cwsServer.sendDataBroadcast(JSON.stringify(serverDataBroadcast));

                                        this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcast));

                                        serverData.status = status;
                                        serverData.result = "System error, check the log for more info.";
                                        this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "run");

                                        this.cp.remove(this.pidKey);

                                        this.pidKey = 0;
                                    } else {
                                        const execCommand2 = `. ${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_SCRIPT}command2.sh`;
                                        const execArgumentList2 = [
                                            `"${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_OUTPUT}artifact"`,
                                            `"${HelperSrc.PATH_ROOT}${HelperSrc.PATH_PUBLIC}"`
                                        ];

                                        execFile(execCommand2, execArgumentList2, { shell: "/bin/bash", encoding: "utf8" }, () => {
                                            const status = /Error:|interrupted|not run/.test(stdout1) ? "error" : "success";

                                            this.resultOutput[clientData.index] = {
                                                state: status,
                                                browser: clientData.browser,
                                                time: HelperSrc.serverTime(),
                                                log: HelperSrc.removeAnsiEscape(stdout1)
                                            };

                                            serverDataBroadcast.result = this.resultOutput;
                                            this.cwsServer.sendDataBroadcast(JSON.stringify(serverDataBroadcast));

                                            this.cp.update(this.pidKey, JSON.stringify(serverDataBroadcast));

                                            serverData.status = status;
                                            serverData.result = "Test completed, check the log for more info.";
                                            this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "run");

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
                            serverData.status = "error";
                            serverData.result = "Another process still running.";
                            serverData.index = clientData.index;
                            this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "run");
                        }
                    });
                } else {
                    serverData.status = "error";
                    serverData.result = "Wrong parameter.";
                    serverData.index = clientData.index;
                    this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "run");
                }
            }
        });
    };

    private runLog = (): void => {
        this.cwsServer.receiveData("runLog", (clientId, data) => {
            if (typeof data === "string") {
                const clientData = JSON.parse(data) as ModelTester.IclientDataRunLog;

                const serverData = {} as ModelTester.IserverData;

                if (clientData.index >= 0 && this.resultOutput[clientData.index]) {
                    serverData.status = "success";
                    serverData.result = this.resultOutput[clientData.index].log;
                } else {
                    serverData.status = "error";
                    serverData.result = "Wrong parameter.";
                }

                this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "runLog");
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

    private video = (): void => {
        this.cwsServer.receiveData("video_list", (clientId, data) => {
            if (typeof data === "string") {
                const clientData = JSON.parse(data) as ModelTester.IclientDataVideo;

                const serverData = {} as ModelTester.IserverData;

                if (clientData.name !== "") {
                    const execCommand = `. ${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_SCRIPT}command3.sh`;
                    const execArgumentList = [`"${HelperSrc.PATH_ROOT}${HelperSrc.PATH_PUBLIC}"`, `"${clientData.name}"`];

                    execFile(execCommand, execArgumentList, { shell: "/bin/bash", encoding: "utf8" }, (_, stdout) => {
                        if (!stdout) {
                            serverData.status = "error";
                            serverData.result = "File not found.";
                            this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "video_list");
                        } else {
                            serverData.status = "success";
                            serverData.result = stdout
                                .trim()
                                .split("\n")
                                .map((name) => name)
                                .sort((a, b) => a.localeCompare(b));
                            this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "video_list");
                        }
                    });
                } else {
                    serverData.status = "error";
                    serverData.result = "Wrong parameter.";
                    this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "video_list");
                }
            }
        });

        this.cwsServer.receiveData("video_delete", (clientId, data) => {
            if (typeof data === "string") {
                const clientData = JSON.parse(data) as ModelTester.IclientDataVideo;

                const serverData = {} as ModelTester.IserverData;

                if (clientData.name !== "") {
                    const execCommand = `. ${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_SCRIPT}command4.sh`;
                    const execArgumentList = [`"${HelperSrc.PATH_ROOT}${HelperSrc.PATH_PUBLIC}"`, `"${clientData.name}"`];

                    execFile(execCommand, execArgumentList, { shell: "/bin/bash", encoding: "utf8" }, () => {
                        serverData.status = "success";
                        serverData.result = "File deleted.";
                        this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "video_delete");
                    });
                } else {
                    serverData.status = "error";
                    serverData.result = "Wrong parameter.";
                    this.cwsServer.sendData(clientId, 1, JSON.stringify(serverData), "video_delete");
                }
            }
        });
    };

    private upload = (): void => {
        this.cwsServer.receiveDataUpload((clientId, data, filename) => {
            Fs.writeFileSync(`${HelperSrc.PATH_ROOT}${HelperSrc.PATH_FILE_INPUT}${filename}`, Buffer.concat(data));

            const requestWsData: ModelTester.IserverData = { status: "success", result: "Upload completed." };
            this.cwsServer.sendData(clientId, 1, JSON.stringify(requestWsData), "upload");
        });
    };
}
