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

import { initFramework } from "../JsFw";

// Source
import ControllerTest from "../controller/Test";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("jsmvcfw_app")!;

    if (root) {
        initFramework(root);

        const controllerTest = new ControllerTest();
        controllerTest.variable();
        controllerTest.view();
        controllerTest.event();
        //controllerTest.destroy();
    }
});
