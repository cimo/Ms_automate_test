import { Icontroller } from "../jsmvcfw/JsMvcFwInterface";
import { writeLog, variableState } from "../jsmvcfw/JsMvcFw";
import CwsClient from "@cimo/websocket/dist/client/Service";
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

export default class ControllerIndex implements Icontroller<IvariableList> {
    // Variable
    private cwsClient: CwsClient;
    private variableList: IvariableList;
    private elementLoader: HTMLElement | null = null;
    private elementTableData: HTMLElement | null;
    private elementTableDataRowList: NodeListOf<HTMLElement> | null;
    private controllerAlert: ControllerAlert | null;
    private controllerDialog: ControllerDialog | null;

    // Method
    constructor(cwsClientValue: CwsClient) {
        this.cwsClient = cwsClientValue;
        this.variableList = {} as IvariableList;
        this.elementLoader = null;
        this.elementTableData = null;
        this.elementTableDataRowList = null;
        this.controllerAlert = null;
        this.controllerDialog = null;

        this.cwsClient.checkConnection((mode) => {
            this.broadcast();

            if (mode === "connection") {
                this.specFileList();
            }
        });
    }

    variable(): IvariableList {
        this.variableList = {
            label: variableState<string>("label", ""),
            specFileList: variableState<string[]>("specFileList", [])
        };

        return this.variableList;
    }

    view(variableList: IvariableList): string {
        writeLog("Home.ts => view()", variableList);

        const viewLoaderTemplate = viewLoader().template;
        const viewAlertTemplate = viewAlert().template;
        const viewDialogTemplate = viewDialog().template;

        return viewPageIndex(variableList, viewLoaderTemplate, viewAlertTemplate, viewDialogTemplate).template;
    }

    event(variableList: IvariableList): void {
        writeLog("Home.ts => event()", variableList);
    }

    destroy(variableList: IvariableList): void {
        writeLog("Home.ts => destroy()", variableList);
    }

    private initializeHtmlElement = (): void => {
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

        this.elementLoader = document.querySelector<HTMLElement>(".view_loader");

        /*this.elementTableClient = document.querySelector<HTMLElement>(".table_client");

        if (this.elementTableClient) {
            this.elementTableClientItem = this.elementTableClient.querySelector<HTMLElement>(".item");
        }*/

        this.elementTableData = document.querySelector<HTMLElement>(".table_data");

        if (this.elementTableData) {
            this.elementTableDataRowList = this.elementTableData.querySelectorAll<HTMLElement>("tbody .row");
        }

        /*this.elementTableVideo = document.querySelector<HTMLElement>(".table_video");

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
        }*/
    };

    private broadcast = (): void => {
        this.cwsClient.receiveData("broadcast", (data) => {
            if (typeof data === "string" && HelperSrc.isJson(data)) {
                const serverData = JSON.parse(data) as ModelTester.IserverDataBroadcast;

                if (serverData.tag === "disconnection") {
                    this.cwsClient.sendData(1, "", "specFileList");
                    //this.cwsClient.sendData(1, "", "user", 100);
                    this.cwsClient.sendData(1, "", "output", 200);
                } else if (serverData.tag === "user") {
                    //this.statusUser(serverData);
                } else if (serverData.tag === "output") {
                    this.statusOutput(serverData);
                }
            }
        });

        this.cwsClient.sendData(1, "", "specFileList");
        //this.cwsClient.sendData(1, "", "user", 100);
        this.cwsClient.sendData(1, "", "output", 200);
    };

    private specFileList = (): void => {
        this.cwsClient.receiveData("specFileList", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                this.variableList.specFileList.state = serverData.result as string[];

                this.controllerAlert = new ControllerAlert();
                this.controllerDialog = new ControllerDialog();

                this.initializeHtmlElement();

                this.run();

                this.runLog();

                /*this.video();

                this.upload();*/

                if (this.elementLoader) {
                    this.elementLoader.style.setProperty("display", "none");
                }
            }
        });
    };

    private statusOutput = (serverData: ModelTester.IserverDataBroadcast): void => {
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
                        if (serverDataOutput.browser) {
                            mdcSelectBrowser.setValue(serverDataOutput.browser);
                        }

                        if (serverDataOutput.state === "running") {
                            elementButtonExecute.disabled = true;

                            elementTime.innerHTML = serverDataOutput.time;

                            elementButtonLog.style.setProperty("display", "none");
                            elementIconLoading.style.setProperty("display", "inline-block");
                            elementIconSuccess.style.setProperty("display", "none");
                            elementIconFail.style.setProperty("display", "none");

                            /*if (this.elementTableVideoItem && this.elementTableVideoPlayer) {
                                this.elementTableVideoItem.innerHTML = "";

                                this.elementTableVideoPlayer.src = "";
                                this.elementTableVideoPlayer.style.setProperty("display", "none");
                            }*/
                        } else {
                            elementButtonExecute.disabled = false;

                            elementTime.innerHTML = serverDataOutput.time;

                            elementButtonLog.style.setProperty("display", "inline-block", "important");
                            elementButtonLog.onclick = () => {
                                const clientDataRunLog: ModelTester.IclientDataRunLog = {
                                    index: parseInt(elementRow.getAttribute("data-index") as string)
                                };
                                this.cwsClient.sendData(1, JSON.stringify(clientDataRunLog), "runLog");
                            };

                            elementIconLoading.style.setProperty("display", "none");

                            if (serverDataOutput.state === "success") {
                                elementIconSuccess.style.setProperty("display", "inline-block");
                            } else if (serverDataOutput.state === "error") {
                                elementIconFail.style.setProperty("display", "inline-block");
                            }
                        }
                    }
                }
            }
        }
    };

    private run = (): void => {
        this.cwsClient.receiveData("run", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverDataRun;

                if (this.elementTableDataRowList && serverData.index) {
                    const elementRow = this.elementTableDataRowList[serverData.index];
                    const elementButtonExecute = elementRow.querySelector<HTMLButtonElement>(".button_execute");

                    if (elementButtonExecute) {
                        elementButtonExecute.disabled = false;
                    }
                }

                if (this.controllerAlert) {
                    this.controllerAlert.open(serverData.status, serverData.result as string);
                }
            }
        });

        if (this.elementTableDataRowList) {
            for (const elementRow of this.elementTableDataRowList) {
                const elementButtonExecute = elementRow.querySelector<HTMLButtonElement>(".button_execute");

                if (elementButtonExecute) {
                    elementButtonExecute.onclick = () => {
                        if (this.controllerAlert) {
                            this.controllerAlert.close();
                        }

                        const elementSpecName = elementRow.querySelector<HTMLElement>(".name");
                        const mdcSelectBrowser = new MDCSelect(elementRow.querySelector(".select_browser") as Element);

                        if (elementSpecName && mdcSelectBrowser) {
                            const clientData: ModelTester.IclientDataRun = {
                                index: parseInt(elementRow.getAttribute("data-index") as string),
                                name: elementSpecName.textContent ? elementSpecName.textContent.trim() : "",
                                browser: mdcSelectBrowser.value
                            };
                            this.cwsClient.sendData(1, JSON.stringify(clientData), "run");
                        }
                    };
                }
            }
        }
    };

    private runLog = (): void => {
        this.cwsClient.receiveData("runLog", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                if (serverData.status === "error") {
                    if (this.controllerAlert) {
                        this.controllerAlert.open(serverData.status, serverData.result as string);
                    }
                } else {
                    if (this.controllerDialog) {
                        this.controllerDialog.open("Log", serverData.result as string, true);
                    }
                }
            }
        });
    };
}
