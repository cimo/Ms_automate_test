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
            serverDataOutput: variableState<ModelTester.IserverDataOutput[]>("serverDataOutput", [])
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
                    this.variableList.serverDataOutput.state = serverData.result as ModelTester.IserverDataOutput[];
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
                    const serverDataOutput = serverData.result[elementKey] as ModelTester.IserverDataOutput;

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
                                const clientDataRunLog: ModelTester.IclientDataRunLog = {
                                    index: parseInt(elementRow.getAttribute("data-index") as string)
                                };
                                this.cwsClient.sendData(1, JSON.stringify(clientDataRunLog), "runLog");
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

        this.cwsClient.receiveData("runLog", (data) => {
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

import { Icontroller, IvirtualNode } from "../JsMvcFwInterface";
import { variableBind } from "../JsMvcFw";
import CwsClient from "@cimo/websocket/dist/client/Manager";
import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";
import { MDCSelect } from "@material/select";

// Source
import * as HelperSrc from "../HelperSrc";
import * as ModelIndex from "../model/Index";
import * as ModelTester from "../model/Tester";
import viewIndex from "../view/Index";
import ControllerAlert from "./Alert";
import ControllerDialog from "./Dialog";

export default class ControllerIndex implements Icontroller {
    // Variable
    private variableList: ModelIndex.Ivariable;
    private methodList: ModelIndex.Imethod;
    private controllerAlert: ControllerAlert | null;
    private controllerDialog: ControllerDialog | null;

    private cwsClient: CwsClient;

    // Method
    private mdcEvent = (): void => {
        const elementMdcButtonList = document.querySelectorAll<HTMLElement>(".mdc-button");

        if (elementMdcButtonList) {
            for (const elementMdcButton of elementMdcButtonList) {
                new MDCRipple(elementMdcButton);
            }
        }

        const elementMdcTextFieldList = document.querySelectorAll<HTMLElement>(".mdc-text-field");

        if (elementMdcTextFieldList) {
            for (const elementMdcTextField of elementMdcTextFieldList) {
                new MDCTextField(elementMdcTextField);
            }
        }

        const elementMdcSelectList = document.querySelectorAll<HTMLElement>(".mdc-select");

        if (elementMdcSelectList) {
            for (const elementMdcSelect of elementMdcSelectList) {
                new MDCSelect(elementMdcSelect);
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
                    this.variableList.userList.state = serverData.result as string[];
                } else if (serverData.tag === "output") {
                    this.variableList.outputList.state = serverData.result as ModelTester.IserverDataOutput[];
                }
            }
        });

        this.cwsClient.sendData(1, "", "specFileList");
        this.cwsClient.sendData(1, "", "user", 100);
        this.cwsClient.sendData(1, "", "output", 200);
    };

    private specFileListReceiveData = (): void => {
        this.cwsClient.receiveData("specFileList", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                this.variableList.specFileList.state = serverData.result as string[];
            }
        });
    };

    constructor(cwsClientValue: CwsClient) {
        this.variableList = {} as ModelIndex.Ivariable;
        this.methodList = {} as ModelIndex.Imethod;
        this.controllerAlert = new ControllerAlert();
        this.controllerDialog = new ControllerDialog();

        this.cwsClient = cwsClientValue;

        this.cwsClient.checkConnection((mode) => {
            this.broadcast();

            if (mode === "connection") {
                this.specFileListReceiveData();

                //this.runReceiveData();

                //this.videoReceiveData();

                //this.uploadReceiveData();

                this.variableList.isLoading.state = false;
            }
        });
    }

    getName(): string {
        return "index";
    }

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Index.ts => variable()");

        this.variableList = variableBind(
            {
                userList: [],
                outputList: [],
                specFileList: [],
                isLoading: true,
                listState: [
                    { id: "a", label: "Elemento A", value: "" },
                    { id: "b", label: "Elemento B", value: "" },
                    { id: "c", label: "Elemento C", value: "" }
                ]
            },
            this.getName()
        );

        this.methodList = {};
    }

    variableLoaded(): void {
        // eslint-disable-next-line no-console
        console.log("Index.ts => variableLoaded()");

        this.mdcEvent();
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Index.ts => view()", this.variableList);

        return viewIndex(this.variableList, this.methodList);
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Index.ts => event()", this.variableList);
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Index.ts => destroy()");
    }

    subControllerList(): Icontroller[] {
        // eslint-disable-next-line no-console
        console.log("Index.ts => subController()");

        const list: Icontroller[] = [];

        if (this.controllerAlert && this.controllerDialog) {
            list.push(this.controllerAlert);
            list.push(this.controllerDialog);
        }

        return list;
    }
}
