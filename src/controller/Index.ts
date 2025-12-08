import { Icontroller, IvirtualNode, variableBind } from "@cimo/jsmvcfw/dist/src/Main";
import CwsClient from "@cimo/websocket/dist/src/client/Manager";
import { ImessageDirect } from "@cimo/websocket/dist/src/client/Model";

// Source
import * as helperSrc from "../HelperSrc";
import * as modelIndex from "../model/Index";
import * as modelTester from "../model/Tester";
import viewIndex from "../view/Index";
import ControllerAlert from "./Alert";
import ControllerDialog from "./Dialog";

export default class Index implements Icontroller {
    // Variable
    private variableObject: modelIndex.Ivariable;
    private methodObject: modelIndex.Imethod;
    private controllerAlert: ControllerAlert;
    private controllerDialog: ControllerDialog;

    private cwsClient: CwsClient;

    // Method
    private checkCwsConnection = (): boolean => {
        if (this.variableObject.isClientConnected.state) {
            return true;
        }

        this.controllerAlert.open("error", "Need connect to the server.", 5000);

        return false;
    };

    private broadcast = (): void => {
        this.cwsClient.receiveData<modelTester.IserverDataBroadcast>("broadcast", (data) => {
            if (data.label === "connection") {
                this.cwsClient.sendMessage("text", "", "client");
            } else if (data.label === "disconnection") {
                this.cwsClient.sendMessage("text", "", "client");
            } else if (data.label === "client") {
                this.variableObject.clientList.state = data.result as string[];
            } else if (data.label === "spec_file") {
                this.variableObject.specFileList.state = data.result as string[];
            } else if (data.label === "output") {
                this.variableObject.outputList.state = data.result as modelTester.Ioutput[];
            }
        });
    };

    private receiveDataClientIdCurrent = (): void => {
        this.cwsClient.receiveData<string>("clientId_current", (data) => {
            this.variableObject.clientIdCurrent.state = data;
        });
    };

    private receiveDataDirect = (): void => {
        this.cwsClient.receiveDataDirect((data) => {
            this.variableObject.isChatVisible.state = true;
            this.variableObject.clientIdSelected.state = data.fromClientId;
            this.variableObject.chatMessageList.state = [data, ...this.variableObject.chatMessageList.state];
        });
    };

    private receiveDataRun = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("run", (data) => {
            this.controllerAlert.open(data.status, data.result as string);
        });
    };

    private receiveDataLog = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("log_run", (data) => {
            this.controllerDialog.open(data.status, data.result as string, true);
        });
    };

    private receiveDataVideo = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("video", (data) => {
            if (data.status === "error") {
                this.controllerAlert.open(data.status, data.result as string);

                this.variableObject.videoList.state = [];
            } else {
                this.variableObject.videoList.state = data.result as string[];
            }
        });

        this.cwsClient.receiveData<modelTester.IserverData>("video_delete", (data) => {
            this.controllerAlert.open(data.status, data.result as string);
        });
    };

    private receiveDataUpload = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("upload", (data) => {
            this.controllerAlert.open(data.status, data.result as string);
        });
    };

    private onClickRun = (index: number, specFileName: string): void => {
        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        if (!this.variableObject.outputList.state[index] || this.variableObject.outputList.state[index].phase !== "running") {
            const clientData: modelTester.IclientDataRun = {
                index,
                specFileName,
                browser: this.hookObject.selectBrowserName[index].value
            };
            this.cwsClient.sendMessage("text", clientData, "run");
        } else {
            const clientData: modelTester.IclientDataStop = { index };
            this.cwsClient.sendMessage("text", clientData, "stop");
        }
    };

    private onClickLogRun = (index: number): void => {
        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        const clientData: modelTester.IclientDataLog = { index };
        this.cwsClient.sendMessage("text", clientData, "log_run");
    };

    private onClickVideoLoad = (): void => {
        this.variableObject.videoSrc.state = "";

        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        const clientData: modelTester.IclientDataVideo = { name: this.hookObject.inputVideoName.value };
        this.cwsClient.sendMessage("text", clientData, "video");
    };

    private onClickVideoShow = (name: string): void => {
        if (name !== "") {
            this.variableObject.videoSrc.state = `${helperSrc.URL_ROOT}/file/${name}`;
        }
    };

    private onClickVideoDelete = (index: number, name: string): void => {
        delete this.variableObject.videoList.state[index];
        this.variableObject.videoSrc.state = "";

        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        const clientData: modelTester.IclientDataVideo = { name };
        this.cwsClient.sendMessage("text", clientData, "video_delete");
    };

    private onClickChooseFile = (): void => {
        if (this.hookObject.inputSpecUpload) {
            this.hookObject.inputSpecUpload.click();

            this.hookObject.inputSpecUpload.onchange = () => {
                if (this.hookObject.inputSpecUpload.files && this.hookObject.inputSpecUpload.files.length > 0) {
                    this.variableObject.uploadFileName.state = this.hookObject.inputSpecUpload.files[0].name;
                } else {
                    this.hookObject.inputSpecUpload.value = "";
                    this.variableObject.uploadFileName.state = "";
                }
            };
        }
    };

    private onClickUpload = (): void => {
        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        if (this.hookObject.inputSpecUpload && this.hookObject.inputSpecUpload.files) {
            const file = this.hookObject.inputSpecUpload.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    if (event.target && event.target.result) {
                        const result = event.target.result as ArrayBuffer;

                        let mimeType = file.type;

                        const fileExtension = file.name.split(".").pop();

                        if (fileExtension) {
                            if (fileExtension.toLowerCase() === "ts") {
                                mimeType = "application/typescript";
                            }
                        }

                        this.cwsClient.sendDataUpload(mimeType, file.name, result);

                        this.cwsClient.sendMessage("text", "", "spec_file");

                        this.variableObject.uploadFileName.state = "";

                        this.hookObject.inputSpecUpload.value = "";
                    }
                };

                reader.readAsArrayBuffer(file);
            } else {
                this.controllerAlert.open("error", "Select a file.");
            }
        }
    };

    private onClickClient = (index: number, clientId: string): void => {
        if (this.variableObject.clientIdCurrent.state !== clientId) {
            this.variableObject.isChatVisible.state = true;
            this.variableObject.clientIdSelected.state = this.variableObject.clientList.state[index];
        }
    };

    private onSendChatMessage = (): void => {
        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        if (this.variableObject.clientIdCurrent.state && this.hookObject.inputChatMessageSend.value !== "") {
            this.cwsClient.sendDataDirect(this.hookObject.inputChatMessageSend.value, this.variableObject.clientIdSelected.state);

            const data: ImessageDirect = {
                time: new Date().toISOString(),
                content: this.hookObject.inputChatMessageSend.value,
                fromClientId: this.variableObject.clientIdCurrent.state,
                toClientId: this.variableObject.clientIdSelected.state
            };

            this.variableObject.chatMessageList.state = [data, ...this.variableObject.chatMessageList.state];
        }
    };

    private onClickChatClose = (): void => {
        this.variableObject.isChatVisible.state = false;
        this.variableObject.clientIdSelected.state = "";
        this.variableObject.chatMessageList.state = [];

        this.hookObject.inputChatMessageSend.value = "";
    };

    private onClickConnect = (): void => {
        if (!this.variableObject.isClientConnected.state) {
            this.cwsClient.open();
        }
    };

    private onErrorVideo = () => {
        this.controllerAlert.open("error", "Content protected, need to be authenticated to view it.");
    };

    constructor() {
        this.variableObject = {} as modelIndex.Ivariable;
        this.methodObject = {} as modelIndex.Imethod;
        this.controllerAlert = new ControllerAlert();
        this.controllerDialog = new ControllerDialog();

        this.cwsClient = new CwsClient(helperSrc.WS_ADRESS);

        this.cwsClient.open();

        this.cwsClient.checkStatus("connection", () => {
            this.variableObject.isClientConnected.state = true;

            this.broadcast();

            this.receiveDataClientIdCurrent();

            this.receiveDataDirect();

            this.receiveDataRun();

            this.receiveDataLog();

            this.receiveDataVideo();

            this.receiveDataUpload();

            this.cwsClient.sendMessage("text", "", "client");
            this.cwsClient.sendMessage("text", "", "spec_file", 100);
            this.cwsClient.sendMessage("text", "", "output", 200);

            this.variableObject.isLoading.state = false;

            this.controllerAlert.open("success", "Client connected.", 5000);
        });

        this.cwsClient.checkStatus("disconnection", () => {
            this.variableObject.isClientConnected.state = false;

            this.controllerAlert.open("error", "Client disconnected.");
        });
    }

    hookObject = {} as modelIndex.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                isLoading: true,
                clientList: [],
                specFileList: [],
                outputList: [],
                videoList: [],
                videoSrc: "",
                uploadFileName: "",
                isChatVisible: false,
                clientIdSelected: "",
                chatMessageList: [],
                isClientConnected: false,
                clientIdCurrent: ""
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickRun: this.onClickRun,
            onClickLogRun: this.onClickLogRun,
            onClickVideoLoad: this.onClickVideoLoad,
            onClickVideoShow: this.onClickVideoShow,
            onClickVideoDelete: this.onClickVideoDelete,
            onClickChooseFile: this.onClickChooseFile,
            onClickUpload: this.onClickUpload,
            onClickClient: this.onClickClient,
            onSendChatMessage: this.onSendChatMessage,
            onClickChatClose: this.onClickChatClose,
            onClickConnect: this.onClickConnect,
            onErrorVideo: this.onErrorVideo
        };
    }

    variableEffect(): void {}

    view(): IvirtualNode {
        return viewIndex(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        resultList.push(this.controllerAlert);
        resultList.push(this.controllerDialog);

        return resultList;
    }

    rendered(): void {}

    destroy(): void {
        this.cwsClient.close();
    }
}
