import { MDCSnackbar } from "@material/snackbar";
import { Cr } from "@cimo/request";

// Source
import * as ModelHelper from "../model/Helper";

const PUBLIC_FILE_OUTPUT = `${process.env.MS_AT_PUBLIC_FILE_OUTPUT || ""}`;
let elementSurface: HTMLElement;
let snackbar: MDCSnackbar;

export const create = (snackbarList: (HTMLElement | MDCSnackbar)[], cr: Cr) => {
    elementSurface = snackbarList[0] as HTMLElement;
    snackbar = snackbarList[1] as MDCSnackbar;

    upload(cr);

    run(cr);

    download(cr);
};

const upload = (cr: Cr) => {
    const elementInputUpload = document.querySelector(".input_upload") as HTMLInputElement;
    const elementButtonUpload = document.querySelector(".button_upload") as HTMLButtonElement;

    elementButtonUpload.addEventListener("click", () => {
        const fileList = elementInputUpload.files;

        if (fileList && fileList.length > 0) {
            const formData = new FormData();
            formData.append("file_name", fileList[0].name);
            formData.append("file", fileList[0]);

            cr.post("/api/upload", {}, formData)
                .then(() => {
                    window.location.reload();
                })
                .catch((error: Error) => {
                    snackbar.labelText = error.toString();
                    snackbar.open();
                });
        }
    });
};

const run = (cr: Cr) => {
    const elementColumTestList = document.querySelectorAll(".table_container .row .column_test") as unknown as HTMLElement[];

    for (const elementColumTest of elementColumTestList) {
        const elementSelectContainer = elementColumTest.querySelector(".select_execute_test") as HTMLElement;
        const elementButtonConatiner = elementColumTest.querySelector(".button_execute_test") as HTMLElement;
        const elementButton = elementButtonConatiner.querySelector("button") as HTMLButtonElement;

        elementButton.addEventListener("click", () => {
            const elementRow = elementButton.closest(".row");

            if (elementRow) {
                const elementTitle = elementRow.querySelector(".title") as HTMLElement;

                const name = elementTitle.textContent?.trim() as string;
                const browser = elementSelectContainer.querySelector(".select_list [aria-selected='true']") as HTMLElement;

                cr.post<ModelHelper.IresponseBody>(
                    "/api/run",
                    {},
                    {
                        name: name,
                        browser: browser.getAttribute("data-value")
                    }
                )
                    .then((data) => {
                        if (data.response.stdout !== "") {
                            elementSurface.classList.add("success");
                            snackbar.labelText = data.response.stdout;
                        } else if (data.response.stderr !== "") {
                            elementSurface.classList.add("error");
                            snackbar.labelText = data.response.stderr.toString();
                        }

                        snackbar.open();
                    })
                    .catch((error: Error) => {
                        elementSurface.classList.add("error");
                        snackbar.labelText = error.toString();
                        snackbar.open();
                    });
            }
        });
    }
};

const download = (cr: Cr) => {
    const elementColumVideoList = document.querySelectorAll(".table_container .row .column_video") as unknown as HTMLElement[];

    for (const elementColumVideo of elementColumVideoList) {
        const elementInputContainer = elementColumVideo.querySelector(".input_check_video") as HTMLElement;
        const elementButtonConatiner = elementColumVideo.querySelector(".button_check_video") as HTMLElement;
        const elementVideo = elementColumVideo.querySelector("video") as HTMLVideoElement;
        const elementInput = elementInputContainer.querySelector("input") as HTMLInputElement;
        const elementButton = elementButtonConatiner.querySelector("button") as HTMLButtonElement;

        elementButton.addEventListener("click", () => {
            cr.post<ModelHelper.IresponseBody>(
                "/api/download",
                {},
                {
                    name: elementInput.value
                }
            )
                .then((data) => {
                    if (data.response.stdout !== "") {
                        elementVideo.src = `${PUBLIC_FILE_OUTPUT}${data.response.stdout}`;
                    } else if (data.response.stderr !== "") {
                        snackbar.labelText = data.response.stderr.toString();
                        snackbar.open();
                    }
                })
                .catch((error: Error) => {
                    snackbar.labelText = error.toString();
                    snackbar.open();
                });
        });
    }
};
