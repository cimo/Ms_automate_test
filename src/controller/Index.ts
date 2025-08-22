import {
    Icontroller,
    IvariableEffect,
    IvirtualNode,
    variableBind,
    elementObserver,
    elementObserverOff,
    elementObserverOn
} from "@cimo/jsmvcfw/dist/src/Main";
import CwsClient from "@cimo/websocket/dist/src/client/Manager";
import { MDCSelect } from "@material/select";
import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";

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
    private controllerAlert: ControllerAlert | null;
    private controllerDialog: ControllerDialog | null;

    private mdcSelectList: MDCSelect[];
    private mdcRippleList: MDCRipple[];
    private mdcTextFieldList: MDCTextField[];

    private cwsClient: CwsClient;

    // Method
    private mdcEvent = (): void => {
        // MDCSelect
        for (const value of this.mdcSelectList) {
            value.destroy();
        }

        this.mdcSelectList = [];

        const elementMdcSelectList = document.querySelectorAll<HTMLElement>(".mdc-select");

        if (elementMdcSelectList) {
            for (const [key, elementMdcSelect] of Object.entries(elementMdcSelectList)) {
                const index = parseInt(key);

                this.mdcSelectList.push(new MDCSelect(elementMdcSelect));

                elementObserver(elementMdcSelect, (element, change) => {
                    elementObserverOff(element);

                    if (change.type === "childList") {
                        this.mdcSelectList[index].setValue(this.mdcSelectList[index].value);
                    }

                    elementObserverOn(element);
                });
            }
        }

        // MDCRipple
        for (const value of this.mdcRippleList) {
            value.destroy();
        }

        this.mdcRippleList = [];

        const elementMdcButtonList = document.querySelectorAll<HTMLElement>(".mdc-button");

        if (elementMdcButtonList) {
            for (const [, elementMdcButton] of Object.entries(elementMdcButtonList)) {
                this.mdcRippleList.push(new MDCRipple(elementMdcButton));
            }
        }

        // MDCTextField
        for (const value of this.mdcTextFieldList) {
            value.destroy();
        }

        this.mdcTextFieldList = [];

        const elementMdcTextFieldList = document.querySelectorAll<HTMLElement>(".mdc-text-field");

        if (elementMdcTextFieldList) {
            for (const elementMdcTextField of elementMdcTextFieldList) {
                this.mdcTextFieldList.push(new MDCTextField(elementMdcTextField));
            }
        }
    };

    private checkCwsConnection = (): boolean => {
        if (this.variableObject.isClientConnected.state) {
            return true;
        }

        if (this.controllerAlert) {
            this.controllerAlert.open("error", "Need connect to the server.", 5000);
        }

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
            this.variableObject.clientCurrentId.state = data;
        });
    };

    private receiveDataDirect = (): void => {
        this.cwsClient.receiveDataDirect((data) => {
            this.variableObject.isChatVisible.state = true;
            this.variableObject.clientIdSelected.state = data.fromClientId;
            this.variableObject.chatMessageReceivedList.state = [data, ...this.variableObject.chatMessageReceivedList.state];
        });
    };

    private receiveDataRun = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("run", (data) => {
            if (this.controllerAlert) {
                this.controllerAlert.open(data.status, data.result as string);
            }
        });
    };

    private receiveDataLog = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("log_run", (data) => {
            if (this.controllerDialog) {
                this.controllerDialog.open(data.status, data.result as string, true);
            }
        });
    };

    private receiveDataVideo = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("video", (data) => {
            if (data.status === "error") {
                if (this.controllerAlert) {
                    this.controllerAlert.open(data.status, data.result as string);
                }

                this.variableObject.videoList.state = [];
            } else {
                this.variableObject.videoList.state = data.result as string[];
            }
        });

        this.cwsClient.receiveData<modelTester.IserverData>("video_delete", (data) => {
            if (this.controllerAlert) {
                this.controllerAlert.open(data.status, data.result as string);
            }
        });
    };

    private receiveDataUpload = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("upload", (data) => {
            if (this.controllerAlert) {
                this.controllerAlert.open(data.status, data.result as string);
            }
        });
    };

    private onClickRun = (index: number, specFileName: string): void => {
        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        if (!this.variableObject.outputList.state[index] || this.variableObject.outputList.state[index].phase !== "running") {
            const elementSelected = this.elementHookObject.selectBrowserName[index].querySelector(".mdc-deprecated-list-item--selected");
            const attributeValue = elementSelected ? (elementSelected.getAttribute("data-value") as string) : "";

            const clientData: modelTester.IclientDataRun = {
                index,
                specFileName,
                browser: attributeValue
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

        const clientData: modelTester.IclientDataVideo = { name: this.elementHookObject.inputVideoName.value };
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
        const element = this.elementHookObject.inputSpecUpload;

        if (element) {
            element.click();

            element.onchange = () => {
                if (element.files && element.files.length > 0) {
                    this.variableObject.uploadFileName.state = element.files[0].name;
                } else {
                    element.value = "";
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

        const element = this.elementHookObject.inputSpecUpload;

        if (element && element.files) {
            const file = element.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    if (event.target && event.target.result) {
                        const result = event.target.result as ArrayBuffer;

                        this.cwsClient.sendDataUpload(file.name, result);

                        this.cwsClient.sendMessage("text", "", "spec_file");

                        element.value = "";
                        this.variableObject.uploadFileName.state = "";
                    }
                };

                reader.readAsArrayBuffer(file);
            } else {
                if (this.controllerAlert) {
                    this.controllerAlert.open("error", "Select a file.");
                }
            }
        }
    };

    private onClickClient = (index: number, clientId: string): void => {
        if (this.variableObject.clientCurrentId.state !== clientId) {
            this.variableObject.isChatVisible.state = true;
            this.variableObject.clientIdSelected.state = this.variableObject.clientList.state[index];
        }
    };

    private onSendChatMessage = (): void => {
        const check = this.checkCwsConnection();

        if (!check) {
            return;
        }

        if (this.elementHookObject.inputChatMessageSend.value !== "") {
            this.cwsClient.sendDataDirect(this.elementHookObject.inputChatMessageSend.value, this.variableObject.clientIdSelected.state);
        }
    };

    private onClickChatClose = (): void => {
        this.variableObject.isChatVisible.state = false;
        this.variableObject.clientIdSelected.state = "";
        this.elementHookObject.inputChatMessageSend.value = "";
        this.variableObject.chatMessageReceivedList.state = [];
    };

    private onClickConnect = (): void => {
        if (!this.variableObject.isClientConnected.state) {
            this.cwsClient.open();
        }
    };

    private onErrorVideo = () => {
        if (this.controllerAlert) {
            this.controllerAlert.open("error", "Content protected, need to be authenticated to view it.");
        }
    };

    constructor() {
        this.variableObject = {} as modelIndex.Ivariable;
        this.methodObject = {} as modelIndex.Imethod;
        this.controllerAlert = new ControllerAlert();
        this.controllerDialog = new ControllerDialog();

        this.mdcSelectList = [];
        this.mdcRippleList = [];
        this.mdcTextFieldList = [];

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

            if (this.controllerAlert) {
                this.controllerAlert.open("success", "Client connected.", 5000);
            }
        });

        this.cwsClient.checkStatus("disconnection", () => {
            this.variableObject.isClientConnected.state = false;

            if (this.controllerAlert) {
                this.controllerAlert.open("error", "Client disconnected.");
            }
        });
    }

    elementHookObject = {} as modelIndex.IelementHook;

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
                chatMessageReceivedList: [],
                isClientConnected: false,
                clientCurrentId: ""
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

    variableEffect(watch: IvariableEffect): void {
        watch([
            {
                list: ["specFileList"],
                action: () => {
                    this.mdcEvent();
                }
            },
            {
                list: ["outputList"],
                action: () => {
                    this.mdcEvent();
                }
            }
        ]);
    }

    view(): IvirtualNode {
        return viewIndex(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        if (this.controllerAlert && this.controllerDialog) {
            resultList.push(this.controllerAlert);
            resultList.push(this.controllerDialog);
        }

        return resultList;
    }

    rendered(): void {}

    destroy(): void {
        this.cwsClient.close();
    }
}
