/*import { Icontroller } from "../JsMvcFwInterface";
import { writeLog, variableState } from "../JsMvcFw";
import CwsClient from "@cimo/websocket/dist/client/Manager";
import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";
import { MDCSelect } from "@material/select";

// Source
import * as HelperSrc from "../HelperSrc";
import * as ModelTester from "../model/Tester";
import { IvariableList } from "../model/Index";
import viewPageIndex from "../view/PageIndex";
import viewLoader from "../view/Loader";
import viewAlert from "../view/Alert";
import ControllerAlert from "./Alert";
import viewDialog from "../view/Dialog";
import ControllerDialog from "./Dialog";
import viewSpecFile from "../view/SpecFile";
import viewClient from "../view/Client";
import viewVideo from "../view/Video";
import viewUpload from "../view/Upload";

export default class ControllerIndex implements Icontroller<IvariableList> {
    // Variable
    private cwsClient: CwsClient;
    private variableList: IvariableList;
    private elementButtonExecuteList: HTMLButtonElement[] | null;

    private elementLoader: HTMLElement | null;
    //private elementTableData: HTMLElement | null;
    //private elementTableDataRowList: NodeListOf<HTMLElement> | null;
    private elementTableVideo: HTMLElement | null;
    private elementTableVideoButtonLoad: HTMLButtonElement | null;
    private elementTableVideoInput: HTMLInputElement | null;
    private elementTableVideoItem: HTMLElement | null;
    private elementTableVideoPlayer: HTMLVideoElement | null;
    private elementTableUpload: HTMLElement | null;
    private elementTableUploadButton: HTMLButtonElement | null;
    private elementTableUploadButtonFake: HTMLButtonElement | null;
    private elementTableUploadInput: HTMLInputElement | null;
    private controllerAlert: ControllerAlert | null;
    private controllerDialog: ControllerDialog | null;

    // Method
    constructor(cwsClientValue: CwsClient) {
        this.cwsClient = cwsClientValue;
        this.variableList = {} as IvariableList;
        this.elementButtonExecuteList = null;

        this.elementLoader = null;
        //this.elementTableData = null;
        //this.elementTableDataRowList = null;
        this.elementTableVideo = null;
        this.elementTableVideoButtonLoad = null;
        this.elementTableVideoInput = null;
        this.elementTableVideoItem = null;
        this.elementTableVideoPlayer = null;
        this.elementTableUpload = null;
        this.elementTableUploadButton = null;
        this.elementTableUploadButtonFake = null;
        this.elementTableUploadInput = null;
        this.controllerAlert = null;
        this.controllerDialog = null;

        this.cwsClient.checkConnection((mode) => {
            this.broadcast();

            if (mode === "connection") {
                this.specFileList();
            }

            this.viewInitialize();
            this.viewAction();
        });
    }

    variable(): IvariableList {
        this.variableList = {
            specFileList: variableState<string[]>("specFileList", []),
            clientList: variableState<string[]>("clientList", []),
            serverDataOutput: variableState<ModelTester.Ioutput[]>("serverDataOutput", [])
        };

        return this.variableList;
    }

    view(variableList: IvariableList): string {
        writeLog("Index.ts => view()", variableList);

        const viewLoaderTemplate = viewLoader().template;
        const viewAlertTemplate = viewAlert().template;
        const viewDialogTemplate = viewDialog().template;
        const viewSpecFileTemplate = viewSpecFile(variableList).template;
        const viewClientTemplate = viewClient(variableList).template;
        const viewVideoTemplate = viewVideo().template;
        const viewUploadTemplate = viewUpload().template;

        return viewPageIndex(
            viewLoaderTemplate,
            viewAlertTemplate,
            viewDialogTemplate,
            viewSpecFileTemplate,
            viewClientTemplate,
            viewVideoTemplate,
            viewUploadTemplate
        ).template;
    }

    event(variableList: IvariableList): void {
        writeLog("Index.ts => event()", variableList);

        this.run();

        this.video();

        this.upload();
    }

    destroy(variableList: IvariableList): void {
        writeLog("Index.ts => destroy()", variableList);
    }

    private viewInitialize = (): void => {
        this.controllerAlert = new ControllerAlert();
        this.controllerDialog = new ControllerDialog();

        this.elementButtonExecuteList = Array.from(document.querySelectorAll<HTMLButtonElement>(".button_execute"));

        this.elementLoader = document.querySelector<HTMLElement>(".view_loader");

        if (this.elementLoader) {
            this.elementLoader.style.setProperty("display", "none");
        }

        /---this.elementTableData = document.querySelector<HTMLElement>(".table_data");

        if (this.elementTableData) {
            this.elementTableDataRowList = this.elementTableData.querySelectorAll<HTMLElement>("tbody .row");
        }---/

        this.elementTableVideo = document.querySelector<HTMLElement>(".table_video");

        if (this.elementTableVideo) {
            this.elementTableVideoButtonLoad = this.elementTableVideo.querySelector<HTMLButtonElement>(".button_load");
            this.elementTableVideoInput = this.elementTableVideo.querySelector<HTMLInputElement>(".input_video input");
            this.elementTableVideoItem = this.elementTableVideo.querySelector<HTMLElement>(".item");
            this.elementTableVideoPlayer = this.elementTableVideo.querySelector<HTMLVideoElement>("video");
        }

        this.elementTableUpload = document.querySelector<HTMLElement>(".table_upload");

        if (this.elementTableUpload) {
            this.elementTableUploadButton = this.elementTableUpload.querySelector<HTMLButtonElement>(".button_upload");
            this.elementTableUploadButtonFake = this.elementTableUpload.querySelector<HTMLButtonElement>(".button_input_upload_fake");
            this.elementTableUploadInput = this.elementTableUpload.querySelector<HTMLInputElement>(".input_upload");
        }

        const elementMdcButtonList = document.querySelectorAll<HTMLElement>(".mdc-button");

        for (const elementMdcButton of elementMdcButtonList) {
            new MDCRipple(elementMdcButton);
        }

        const elementMdcTextFieldList = document.querySelectorAll<HTMLElement>(".mdc-text-field");

        for (const elementMdcTextField of elementMdcTextFieldList) {
            new MDCTextField(elementMdcTextField);
        }

        const elementMdcSelectList = document.querySelectorAll<HTMLElement>(".mdc-select");

        for (const elementMdcSelect of elementMdcSelectList) {
            new MDCSelect(elementMdcSelect);
        }
    };

    private viewAction = (): void => {
        if (this.elementButtonExecuteList) {
            for (const [, buttonExecuteValue] of Object.entries(this.elementButtonExecuteList)) {
                buttonExecuteValue.onclick = () => {
                    if (this.controllerAlert) {
                        this.controllerAlert.close();
                    }

                    const elementRow = buttonExecuteValue.closest<HTMLElement>(".row");

                    if (elementRow) {
                        if (buttonExecuteValue.classList.contains("start")) {
                            const elementName = elementRow.querySelector<HTMLElement>(".name");
                            const mdcSelectBrowser = new MDCSelect(elementRow.querySelector(".select_browser") as Element);

                            if (elementName && mdcSelectBrowser) {
                                const clientData: ModelTester.IclientDataRun = {
                                    index: parseInt(elementRow.getAttribute("data-index") as string),
                                    name: elementName.textContent ? elementName.textContent.trim() : "",
                                    browser: mdcSelectBrowser.value
                                };
                                this.cwsClient.sendData(1, JSON.stringify(clientData), "run");
                            }
                        } else {
                            const clientData: ModelTester.IclientDataStop = {
                                index: parseInt(elementRow.getAttribute("data-index") as string)
                            };

                            this.cwsClient.sendData(1, JSON.stringify(clientData), "stop");
                        }
                    }
                };
            }
        }
    };

    private broadcast = (): void => {
        this.cwsClient.receiveData("broadcast", (data) => {
            if (typeof data === "string" && HelperSrc.isJson(data)) {
                const serverData = JSON.parse(data) as ModelTester.IserverDataBroadcast;

                if (serverData.tag === "disconnection") {
                    this.cwsClient.sendData(1, "", "specFileList");
                    this.cwsClient.sendData(1, "", "user", 100);
                    this.cwsClient.sendData(1, "", "output", 200);
                } else if (serverData.tag === "user") {
                    this.variableList.clientList.state = serverData.result as string[];
                } else if (serverData.tag === "output") {
                    this.variableList.serverDataOutput.state = serverData.result as ModelTester.Ioutput[];
                }
            }
        });

        this.cwsClient.sendData(1, "", "specFileList");
        this.cwsClient.sendData(1, "", "user", 100);
        this.cwsClient.sendData(1, "", "output", 200);
    };

    private specFileList = (): void => {
        this.cwsClient.receiveData("specFileList", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                this.variableList.specFileList.state = serverData.result as string[];
            }
        });
    };

    /---private statusOutput = (serverData: ModelTester.IserverDataBroadcast): void => {
        if (this.elementTableDataRowList) {
            for (const [elementKey, elementRow] of Object.entries(this.elementTableDataRowList)) {
                const mdcSelectBrowser = new MDCSelect(elementRow.querySelector(".select_browser") as Element);
                const elementButtonExecute = elementRow.querySelector<HTMLButtonElement>(".button_execute");
                const elementTime = elementRow.querySelector<HTMLElement>(".time");
                const elementButtonLog = elementRow.querySelector<HTMLButtonElement>(".button_log");
                const elementIconLoading = elementRow.querySelector<HTMLElement>(".icon_loading");
                const elementIconSuccess = elementRow.querySelector<HTMLElement>(".icon_success");
                const elementIconFail = elementRow.querySelector<HTMLElement>(".icon_fail");

                if (
                    mdcSelectBrowser &&
                    elementButtonExecute &&
                    elementTime &&
                    elementButtonLog &&
                    elementIconLoading &&
                    elementIconSuccess &&
                    elementIconFail
                ) {
                    const serverDataOutput = serverData.result[elementKey] as ModelTester.Ioutput;

                    if (serverDataOutput) {
                        const elementButtonExecuteIcon = elementButtonExecute.querySelector<HTMLElement>(".material-icons");

                        if (serverDataOutput.browser) {
                            mdcSelectBrowser.setValue(serverDataOutput.browser);
                        }

                        if (serverDataOutput.status === "running") {
                            if (elementButtonExecuteIcon) {
                                elementButtonExecuteIcon.classList.remove("start");
                                elementButtonExecuteIcon.classList.add("stop");
                                elementButtonExecuteIcon.textContent = "stop";
                            }

                            elementTime.innerHTML = serverDataOutput.time;

                            elementButtonLog.style.setProperty("display", "none");
                            elementIconLoading.style.setProperty("display", "inline-block");
                            elementIconSuccess.style.setProperty("display", "none");
                            elementIconFail.style.setProperty("display", "none");
                        } else {
                            if (elementButtonExecuteIcon) {
                                elementButtonExecuteIcon.classList.remove("stop");
                                elementButtonExecuteIcon.classList.add("start");
                                elementButtonExecuteIcon.textContent = "start";
                            }

                            elementTime.innerHTML = serverDataOutput.time;

                            elementButtonLog.style.setProperty("display", "inline-block", "important");
                            elementButtonLog.onclick = () => {
                                const clientDataRunLog: ModelTester.IclientDataLog = {
                                    index: parseInt(elementRow.getAttribute("data-index") as string)
                                };
                                this.cwsClient.sendData(1, JSON.stringify(clientDataRunLog), "logRun");
                            };

                            elementIconLoading.style.setProperty("display", "none");

                            if (serverDataOutput.status === "success") {
                                elementIconSuccess.style.setProperty("display", "inline-block");
                            } else if (serverDataOutput.status === "error") {
                                elementIconFail.style.setProperty("display", "inline-block");
                            }
                        }
                    }
                }
            }
        }
    };---/

    private run = (): void => {
        this.cwsClient.receiveData("run", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverDataRun;

                if (this.controllerAlert) {
                    this.controllerAlert.open(serverData.status, serverData.result as string);
                }
            }
        });

        this.cwsClient.receiveData("logRun", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                if (serverData.status === "success") {
                    if (this.controllerDialog) {
                        this.controllerDialog.open("Log", serverData.result as string, true);
                    }
                } else {
                    if (this.controllerAlert) {
                        this.controllerAlert.open(serverData.status, serverData.result as string);
                    }
                }
            }
        });
    };

    private video = (): void => {
        this.cwsClient.receiveData("video_list", (data) => {
            if (typeof data === "string" && this.elementTableVideoItem && this.elementTableVideoPlayer) {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                this.elementTableVideoItem.innerHTML = "";
                this.elementTableVideoPlayer.src = "";
                this.elementTableVideoPlayer.style.setProperty("display", "none");

                if (serverData.status === "error") {
                    if (this.controllerAlert) {
                        this.controllerAlert.open(serverData.status, serverData.result as string);
                    }
                } else {
                    const serverDataResultList = serverData.result as string[];

                    for (const resultList of serverDataResultList) {
                        const elementLi = document.createElement("li");
                        elementLi.innerHTML = `<p>${resultList}</p>`;

                        const elementIcon = document.createElement("i");
                        elementIcon.setAttribute("class", "mdc-button__icon material-icons");
                        elementIcon.setAttribute("aria-hidden", "true");
                        elementIcon.textContent = "delete";
                        elementLi.insertBefore(elementIcon, elementLi.firstChild);

                        elementIcon.onclick = () => {
                            elementLi.remove();

                            if (this.elementTableVideoPlayer) {
                                this.elementTableVideoPlayer.src = "";
                                this.elementTableVideoPlayer.style.setProperty("display", "none");
                            }

                            const clientData: ModelTester.IclientDataVideo = { name: resultList };
                            this.cwsClient.sendData(1, JSON.stringify(clientData), "video_delete");
                        };

                        const elementLiText = elementLi.querySelector<HTMLElement>("p");

                        if (elementLiText) {
                            elementLiText.onclick = () => {
                                if (this.elementTableVideoPlayer) {
                                    this.elementTableVideoPlayer.src = `${HelperSrc.URL_ROOT}/file/${resultList}`;
                                    this.elementTableVideoPlayer.style.setProperty("display", "block");
                                }
                            };
                        }

                        this.elementTableVideoItem.appendChild(elementLi);
                    }
                }
            }
        });

        this.cwsClient.receiveData("video_delete", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                if (this.controllerAlert) {
                    this.controllerAlert.open(serverData.status, serverData.result as string);
                }
            }
        });

        if (this.elementTableVideoButtonLoad) {
            this.elementTableVideoButtonLoad.onclick = () => {
                if (this.controllerAlert) {
                    this.controllerAlert.close();
                }

                if (this.elementTableVideoInput) {
                    const clientData: ModelTester.IclientDataVideo = { name: this.elementTableVideoInput.value };
                    this.cwsClient.sendData(1, JSON.stringify(clientData), "video_list");
                }
            };
        }
    };

    private upload = (): void => {
        if (this.elementTableUploadButton && this.elementTableUploadButtonFake) {
            this.elementTableUploadButtonFake.onclick = () => {
                if (this.elementTableUploadInput) {
                    this.elementTableUploadInput.click();
                }
            };

            this.cwsClient.receiveData("upload", (data) => {
                if (typeof data === "string") {
                    const serverData = JSON.parse(data) as ModelTester.IserverData;

                    if (this.controllerAlert) {
                        this.controllerAlert.open(serverData.status, serverData.result as string);
                    }
                }
            });

            this.elementTableUploadButton.onclick = () => {
                if (this.controllerAlert) {
                    this.controllerAlert.close();
                }

                if (this.elementTableUploadInput && this.elementTableUploadInput.files) {
                    const file = this.elementTableUploadInput.files[0];

                    if (file) {
                        const reader = new FileReader();

                        reader.onload = (event) => {
                            if (event.target && event.target.result) {
                                const result = event.target.result as ArrayBuffer;

                                this.cwsClient.sendDataUpload(file.name, result);

                                this.cwsClient.sendData(1, "", "specFileList");
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
        }
    };
}
*/

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

    private cwsClient: CwsClient;
    private mdcSelectList: MDCSelect[];
    private mdcRippleList: MDCRipple[];
    private mdcTextFieldList: MDCTextField[];
    private mdcSelectBrowserObject: Record<string, MDCSelect>;
    private mdcTextFieldVideoObject: Record<string, MDCTextField>;

    // Method
    private mdcSelectBrowser = (mdc: MDCSelect): void => {
        const element = mdc.root;
        const idSplit = element.id.split("mdcSelectBrowser_");

        if (idSplit[1]) {
            this.mdcSelectBrowserObject[element.id] = mdc;
        }
    };

    private mdcTextFieldVideo = (mdc: MDCTextField): void => {
        this.mdcTextFieldVideoObject["mdcTextFieldVideoName"] = mdc;
    };

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

                this.mdcSelectBrowser(this.mdcSelectList[index]);
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
            for (const [key, elementMdcTextField] of Object.entries(elementMdcTextFieldList)) {
                const index = parseInt(key);

                this.mdcTextFieldList.push(new MDCTextField(elementMdcTextField));

                this.mdcTextFieldVideo(this.mdcTextFieldList[index]);
            }
        }
    };

    private broadcast = (): void => {
        this.cwsClient.receiveData<modelTester.IserverDataBroadcast>("broadcast", (message) => {
            if (message.tag === "connection") {
                this.cwsClient.sendData("text", "", "user");
            } else if (message.tag === "disconnection") {
                this.cwsClient.sendData("text", "", "user");
            } else if (message.tag === "user") {
                this.variableObject.userList.state = message.result as string[];
            } else if (message.tag === "spec_file") {
                this.variableObject.specFileList.state = message.result as string[];
            } else if (message.tag === "output") {
                this.variableObject.outputList.state = message.result as modelTester.Ioutput[];
            }
        });
    };

    private runReceiveData = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("run", (message) => {
            if (this.controllerAlert) {
                this.controllerAlert.open(message.status, message.result as string);
            }
        });
    };

    private logReceiveData = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("log_run", (message) => {
            if (this.controllerDialog) {
                this.controllerDialog.open(message.status, message.result as string, true);
            }
        });
    };

    private videoReceiveData = (): void => {
        this.cwsClient.receiveData<modelTester.IserverData>("video", (message) => {
            if (message.status === "error") {
                if (this.controllerAlert) {
                    this.controllerAlert.open(message.status, message.result as string);
                }

                this.variableObject.videoList.state = [];
            } else {
                this.variableObject.videoList.state = message.result as string[];
            }
        });

        this.cwsClient.receiveData<modelTester.IserverData>("video_delete", (message) => {
            if (this.controllerAlert) {
                this.controllerAlert.open(message.status, message.result as string);
            }
        });
    };

    private onClickRun = (index: number, specFileName: string): void => {
        if (!this.variableObject.outputList.state[index] || this.variableObject.outputList.state[index].phase !== "running") {
            const clientData: modelTester.IclientDataRun = {
                index,
                specFileName,
                browser: this.mdcSelectBrowserObject[`mdcSelectBrowser_${index}`].value
            };
            this.cwsClient.sendData("text", clientData, "run");
        } else {
            const clientData: modelTester.IclientDataStop = { index };
            this.cwsClient.sendData("text", clientData, "stop");
        }
    };

    private onClickLogRun = (index: number): void => {
        const clientData: modelTester.IclientDataLog = { index };
        this.cwsClient.sendData("text", clientData, "log_run");
    };

    private onClickVideoLoad = (): void => {
        const clientData: modelTester.IclientDataVideo = { name: this.mdcTextFieldVideoObject["mdcTextFieldVideoName"].value };
        this.cwsClient.sendData("text", clientData, "video");
    };

    private onClickVideoDelete = (event: Event, name: string): void => {
        const target = event.currentTarget as HTMLElement;
        const elementLi = target.closest("li");

        if (elementLi) {
            elementLi.remove();
        }

        const clientData: modelTester.IclientDataVideo = { name };
        this.cwsClient.sendData("text", clientData, "video_delete");
    };

    private onClickVideoShow = (name: string): void => {
        if (name !== "") {
            this.variableObject.videoSrc.state = `${helperSrc.URL_ROOT}/file/${name}`;
        }
    };

    constructor(cwsClientValue: CwsClient) {
        this.variableObject = {} as modelIndex.Ivariable;
        this.methodObject = {} as modelIndex.Imethod;
        this.controllerAlert = new ControllerAlert();
        this.controllerDialog = new ControllerDialog();

        this.cwsClient = cwsClientValue;
        this.mdcSelectList = [];
        this.mdcRippleList = [];
        this.mdcTextFieldList = [];
        this.mdcSelectBrowserObject = {};
        this.mdcTextFieldVideoObject = {};

        this.cwsClient.checkConnection(() => {
            this.broadcast();

            this.runReceiveData();

            this.logReceiveData();

            this.videoReceiveData();

            //this.uploadReceiveData();

            this.cwsClient.sendData("text", "", "user");
            this.cwsClient.sendData("text", "", "spec_file", 100);
            this.cwsClient.sendData("text", "", "output", 200);

            this.variableObject.isLoading.state = false;
        });
    }

    variable(): void {
        this.variableObject = variableBind(
            {
                isLoading: true,
                userList: [],
                specFileList: [],
                outputList: [],
                videoList: [],
                videoSrc: ""
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickRun: this.onClickRun,
            onClickLogRun: this.onClickLogRun,
            onClickVideoLoad: this.onClickVideoLoad,
            onClickVideoDelete: this.onClickVideoDelete,
            onClickVideoShow: this.onClickVideoShow
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

    destroy(): void {}
}
