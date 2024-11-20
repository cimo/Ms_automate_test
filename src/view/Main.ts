//import { MDCRipple } from "@material/ripple";
//import { MDCTextField } from "@material/textfield";
//import { MDCSelect } from "@material/select";
import { mainInit } from "@cimo/jsmvcfw/dist/JsMvcFw";
import { routerInit } from "@cimo/jsmvcfw/dist/JsMvcFwRouter";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import * as HelperSrc from "../HelperSrc";
//import ControllerIndex from "../controller/Index";
import ControllerRouter from "../controller/Router";

mainInit(true, "/", "jsmvcfw_app");

const cwsClient = new CwsClient(HelperSrc.WS_ADRESS);

cwsClient.checkConnection((mode) => {
    const controllerRouter = new ControllerRouter(cwsClient, mode);

    routerInit(controllerRouter.dataMain);
});

/*export default class ViewMain {
    // Variable

    // Method
    constructor() {
        void this.pageLoaded().then(() => {
            const cwsClient = new CwsClient(HelperSrc.WS_ADRESS);

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

            cwsClient.checkConnection((mode) => {
                const controllerIndex = new ControllerIndex(cwsClient);
                controllerIndex.callbackWebsocket(mode);
            });
        });
    }

    pageLoaded = (): Promise<void> => {
        return new Promise((resolve) => {
            if (document.readyState === "complete") {
                resolve();
            } else {
                document.addEventListener("DOMContentLoaded", () => {
                    resolve();
                });
            }
        });
    };
}

new ViewMain();*/
