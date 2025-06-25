/*import { mainInit } from "../JsMvcFw";
import { routerInit } from "../JsMvcFwRouter";
import CwsClient from "@cimo/websocket/dist/client/Manager";

// Source
import * as HelperSrc from "../HelperSrc";
import ControllerRouter from "../controller/Router";

const cwsClient = new CwsClient(HelperSrc.WS_ADRESS);

mainInit(true, "/", "jsmvcfw_app");

const controllerRouter = new ControllerRouter(cwsClient);

routerInit(controllerRouter.dataMain);*/

/*import { defineComponent } from "../JsFw";
import { getCount, incrementCount } from "../controller/Index";

defineComponent("counter-view", {
    template: () => `<div>
        <p>Contatore: <span id="value">${getCount()}</span></p>
        <button id="btn">Incrementa</button>
    </div>`,
    styles: `div { font-family: sans-serif; }
    button { padding: 5px 10px; margin-top: 5px; }`,
    connected: (el) => {
        const shadow = el.shadowRoot!;
        const btn = shadow.getElementById("btn")!;
        const value = shadow.getElementById("value")!;

        btn.addEventListener("click", () => {
            incrementCount();

            value.textContent = String(getCount());
        });
    }
});*/

import { initFramework } from "../JsFw";
import { startApp } from "../controller/Index";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("jsmvcfw_app")!;
    initFramework(root);
    startApp();
});
