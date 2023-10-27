import { Cr } from "@cimo/request";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import * as ControllerAlert from "../controller/Alert";
import * as ModelHelper from "../model/Helper";
import * as ModelIndex from "../model/Index";

const PUBLIC_FILE_OUTPUT = `${process.env.MS_AT_PUBLIC_FILE_OUTPUT || ""}`;

export const create = (cr: Cr, cwsClient: CwsClient) => {
    ControllerAlert.create();

    run(cr, cwsClient);

    upload(cr);

    download(cr);

    websocket(cwsClient);
};

const run = (cr: Cr, cwsClient: CwsClient) => {
    const elementColumTestList = document.querySelectorAll(".table_list .row .column_action") as unknown as HTMLElement[];

    for (const elementColumTest of elementColumTestList) {
        const elementSelectContainer = elementColumTest.querySelector(".select_execute_test") as HTMLElement;
        const elementButton = elementColumTest.querySelector(".button_execute_test button") as HTMLButtonElement;

        elementButton.addEventListener("click", () => {
            const elementRow = elementButton.closest(".row");

            if (elementRow) {
                const elementTitle = elementRow.querySelector(".title") as HTMLElement;
                const name = elementTitle.textContent?.trim() as string;
                const elementSelected = elementSelectContainer.querySelector(".select_list [aria-selected='true']") as HTMLElement;

                cwsClient.sendMessage("api_run", {
                    name: name,
                    browser: elementSelected.getAttribute("data-value"),
                    process_number: elementRow.getAttribute("data-process")
                });
            }
        });
    }
};

const download = (cr: Cr) => {
    const elementTableSide = document.querySelector(".table_side") as HTMLElement;
    const elementButton = elementTableSide.querySelector(".button_video button") as HTMLButtonElement;
    const elementInput = elementTableSide.querySelector(".input_video input") as HTMLInputElement;
    const elementVideo = elementTableSide.querySelector("video") as HTMLVideoElement;

    elementButton.addEventListener("click", () => {
        const elementRow = elementButton.closest(".row");

        if (elementRow) {
            cr.post<ModelHelper.IresponseBody>(
                "/api/download",
                {},
                {
                    name: elementInput.value,
                    process_number: elementRow.getAttribute("data-process")
                }
            )
                .then((data) => {
                    if (data.response.stdout !== "") {
                        elementVideo.src = `${PUBLIC_FILE_OUTPUT}${data.response.stdout}`;
                    } else if (data.response.stderr !== "") {
                        ControllerAlert.open("error", data.response.stderr.toString());
                    }
                })
                .catch((error: Error) => {
                    ControllerAlert.open("error", error.toString());
                });
        }
    });
};

const upload = (cr: Cr) => {
    const elementTableSide = document.querySelector(".table_side") as HTMLElement;
    const elementButton = elementTableSide.querySelector(".button_upload button") as HTMLButtonElement;
    const elementInput = elementTableSide.querySelector(".input_upload") as HTMLInputElement;

    elementButton.addEventListener("click", () => {
        const elementRow = elementButton.closest(".row");

        if (elementRow) {
            const fileList = elementInput.files;

            const formData = new FormData();

            if (fileList && fileList.length > 0) {
                formData.append("file_name", fileList[0].name);
                formData.append("file", fileList[0]);
            }

            formData.append("process_number", elementRow.getAttribute("data-process") as string);

            cr.post<ModelHelper.IresponseBody>("/api/upload", {}, formData)
                .then((data) => {
                    if (data.response.stdout !== "") {
                        window.location.reload();
                    } else if (data.response.stderr !== "") {
                        ControllerAlert.open("error", data.response.stderr.toString());
                    }
                })
                .catch((error: Error) => {
                    ControllerAlert.open("error", error.toString());
                });
        }
    });
};

const websocket = (cwsClient: CwsClient) => {
    cwsClient.receiveMessage("process", (data) => {
        const message = data.message as unknown as ModelIndex.Iprocess;

        let tag = "";

        if (message.name === "list") {
            tag = ".table_list";
        } else if (message.name === "side") {
            tag = ".table_side";
        }

        const elementRow = document.querySelector(`${tag} .row[data-process='${message.number}']`) as HTMLButtonElement;
        const elementIcon = elementRow.querySelector(".icon_process") as HTMLElement;

        if (elementIcon) {
            if (message.status === "start") {
                elementIcon.style.display = "block";
            } else if (message.status === "end") {
                elementIcon.style.display = "none";
            }
        }
    });

    cwsClient.receiveMessage("api_run", (data) => {
        const message = data.message as unknown as ModelHelper.IresponseExec;

        if (message.stdout !== "") {
            ControllerAlert.open("success", message.stdout);
        } else if (message.stderr !== "") {
            ControllerAlert.open("error", message.stderr.toString());
        }
    });
};
