import { MDCSnackbar } from "@material/snackbar";
import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";
import { MDCSelect } from "@material/select";
import { Cr } from "@cimo/request";
import * as CwsClient from "@cimo/websocket/dist/client/Message";

// Source
import * as Index from "./Index";

const HOST = `${process.env.DOMAIN || ""}:${process.env.SERVER_PORT || ""}`;

// Mdc
const elementMdcSnackbar = document.querySelector(".mdc-snackbar") as HTMLElement;
const elementSurface = elementMdcSnackbar.querySelector(".mdc-snackbar__surface") as HTMLElement;
const snackbar = new MDCSnackbar(elementMdcSnackbar);
snackbar.timeoutMs = -1;

const elementMdcButtonList = document.querySelectorAll(".mdc-button") as unknown as HTMLElement[];
for (const elementMdcButton of elementMdcButtonList) {
    new MDCRipple(elementMdcButton);
}

const elementMdcTextFieldList = document.querySelectorAll(".mdc-text-field") as unknown as HTMLElement[];
for (const elementMdcTextField of elementMdcTextFieldList) {
    new MDCTextField(elementMdcTextField);
}

const elementMdcSelectList = document.querySelectorAll(".mdc-select") as unknown as HTMLElement[];
for (const elementMdcSelect of elementMdcSelectList) {
    new MDCSelect(elementMdcSelect);
}

// Request
const cr = new Cr(`https://${HOST}`, 30000);

cr.setResponseInterceptor(() => {
    elementSurface.classList.remove("success");
    elementSurface.classList.remove("error");
});

// Websocket
CwsClient.connection(HOST);

Index.create([elementSurface, snackbar], cr);
