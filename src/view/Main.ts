import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";
import { MDCSelect } from "@material/select";
import { Cr } from "@cimo/request";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import * as ViewIndex from "./Index";

const HOST = `${process.env.DOMAIN || ""}:${process.env.SERVER_PORT || ""}`;

// Mdc
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

// Websocket
const cwsClient = new CwsClient();
cwsClient.connection(HOST);

// View
ViewIndex.create(cr, cwsClient);
