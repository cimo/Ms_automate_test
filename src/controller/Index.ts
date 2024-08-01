import CwsClient from "@cimo/websocket/dist/client/Service";
import { MDCSelect } from "@material/select";

// Source
import * as HelperSrc from "../HelperSrc";
import * as ModelTester from "../model/Tester";
import ControllerAlert from "../controller/Alert";
import ControllerDialog from "../controller/Dialog";

export default class ControllerIndex {
    // Variable
    private cwsClient: CwsClient;
    private controllerAlert: ControllerAlert;
    private controllerDialog: ControllerDialog;

    private urlRoot: string;
    private urlFileOutput: string;

    private elementLoader: HTMLElement | null = null;
    private elementTableClient: HTMLElement | null = null;
    private elementTableClientItem: HTMLElement | null = null;
    private elementTableData: HTMLElement | null = null;
    private elementTableDataRowList: NodeListOf<HTMLElement> | null = null;
    private elementTableVideo: HTMLElement | null = null;
    private elementTableVideoButtonLoad: HTMLButtonElement | null = null;
    private elementTableVideoInput: HTMLInputElement | null = null;
    private elementTableVideoItem: HTMLElement | null = null;
    private elementTableVideoPlayer: HTMLVideoElement | null = null;
    private elementTableUpload: HTMLElement | null = null;
    private elementTableUploadButton: HTMLButtonElement | null = null;
    private elementTableUploadButtonFake: HTMLButtonElement | null = null;
    private elementTableUploadInput: HTMLInputElement | null = null;

    // Method
    constructor(cwsClient: CwsClient) {
        this.cwsClient = cwsClient;
        this.controllerAlert = new ControllerAlert();
        this.controllerDialog = new ControllerDialog();

        this.urlRoot = HelperSrc.URL_ROOT;
        this.urlFileOutput = `${this.urlRoot}/file`;

        this.initializeHtmlElement();
    }

    callbackWebsocket = (mode: string): void => {
        if (this.elementLoader) {
            this.elementLoader.style.setProperty("display", "none");
        }

        this.broadcast();

        if (mode === "connection") {
            this.run();

            this.logRun();

            this.video();

            this.upload();
        }
    };

    private initializeHtmlElement = (): void => {
        this.elementLoader = document.querySelector<HTMLElement>(".view_loader");

        this.elementTableClient = document.querySelector<HTMLElement>(".table_client");

        if (this.elementTableClient) {
            this.elementTableClientItem = this.elementTableClient.querySelector<HTMLElement>(".item");
        }

        this.elementTableData = document.querySelector<HTMLElement>(".table_data");

        if (this.elementTableData) {
            this.elementTableDataRowList = this.elementTableData.querySelectorAll<HTMLElement>("tbody .row");
        }

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
    };

    private broadcast = (): void => {
        this.cwsClient.receiveData("broadcast", (data) => {
            if (typeof data === "string" && HelperSrc.isJson(data)) {
                const serverData = JSON.parse(data) as ModelTester.IserverDataBroadcast;

                if (serverData.tag === "disconnection") {
                    this.cwsClient.sendData(1, "", "user");
                    this.cwsClient.sendData(1, "", "output", 100);
                } else if (serverData.tag === "user") {
                    this.statusUser(serverData);
                } else if (serverData.tag === "output") {
                    this.statusOutput(serverData);
                }
            }
        });

        this.cwsClient.sendData(1, "", "user");
        this.cwsClient.sendData(1, "", "output", 100);
    };

    private statusUser = (serverData: ModelTester.IserverDataBroadcast): void => {
        if (this.elementTableClientItem) {
            this.elementTableClientItem.innerHTML = "";

            const serverDataResultList = serverData.result as string[];

            for (const serverDataResult of serverDataResultList) {
                const elementLi = document.createElement("li");
                elementLi.innerHTML = `<p>${serverDataResult}</p>`;

                const elementIcon = document.createElement("i");
                elementIcon.setAttribute("class", "mdc-button__icon material-icons");
                elementIcon.setAttribute("aria-hidden", "true");
                elementIcon.textContent = "person";
                elementLi.insertBefore(elementIcon, elementLi.firstChild);

                this.elementTableClientItem.appendChild(elementLi);
            }
        }
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

                            if (this.elementTableVideoItem && this.elementTableVideoPlayer) {
                                this.elementTableVideoItem.innerHTML = "";

                                this.elementTableVideoPlayer.src = "";
                                this.elementTableVideoPlayer.style.setProperty("display", "none");
                            }
                        } else {
                            elementButtonExecute.disabled = false;

                            elementTime.innerHTML = serverDataOutput.time;

                            elementButtonLog.style.setProperty("display", "inline-block", "important");
                            elementButtonLog.onclick = () => {
                                const clientDataLogRun: ModelTester.IclientDataLogRun = {
                                    index: parseInt(elementRow.getAttribute("data-index") as string)
                                };
                                this.cwsClient.sendData(1, JSON.stringify(clientDataLogRun), "logRun");
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

                this.controllerAlert.open(serverData.status, serverData.result as string);
            }
        });

        if (this.elementTableDataRowList) {
            for (const elementRow of this.elementTableDataRowList) {
                const elementButtonExecute = elementRow.querySelector<HTMLButtonElement>(".button_execute");

                if (elementButtonExecute) {
                    elementButtonExecute.onclick = () => {
                        this.controllerAlert.close();

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

    private logRun = (): void => {
        this.cwsClient.receiveData("logRun", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                if (serverData.status === "error") {
                    this.controllerAlert.open(serverData.status, serverData.result as string);
                } else {
                    this.controllerDialog.open("Log", serverData.result as string, true);
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
                    this.controllerAlert.open(serverData.status, serverData.result as string);
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
                                    this.elementTableVideoPlayer.src = `${this.urlFileOutput}/${resultList}`;
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

                this.controllerAlert.open(serverData.status, serverData.result as string);
            }
        });

        if (this.elementTableVideoButtonLoad) {
            this.elementTableVideoButtonLoad.onclick = () => {
                this.controllerAlert.close();

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

                    this.controllerAlert.open(serverData.status, serverData.result as string);
                }
            });

            this.elementTableUploadButton.onclick = () => {
                this.controllerAlert.close();

                if (this.elementTableUploadInput && this.elementTableUploadInput.files) {
                    const file = this.elementTableUploadInput.files[0];

                    if (file) {
                        const reader = new FileReader();

                        reader.onload = (event) => {
                            if (event.target && event.target.result) {
                                const result = event.target.result as ArrayBuffer;

                                this.cwsClient.sendDataUpload(file.name, result);
                            }
                        };

                        reader.readAsArrayBuffer(file);
                    } else {
                        this.controllerAlert.open("error", "Select a file.");
                    }
                }
            };
        }
    };
}
