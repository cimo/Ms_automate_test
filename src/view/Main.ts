/*import { frameworkInit } from "../JsMvcBase";
import { routerInit } from "../JsMvcFwRouter";
import CwsClient from "@cimo/websocket/dist/client/Manager";

// Source
import * as HelperSrc from "../HelperSrc";
import ControllerIndex from "../controller/Index";

const cwsClient = new CwsClient(HelperSrc.WS_ADRESS);

frameworkInit(true, "/", "jsmvcfw_app");

routerInit([
    {
        title: "Index",
        path: `${HelperSrc.URL_ROOT}/ui`,
        controller: () => new ControllerIndex(cwsClient)
    }
]);*/

import { renderTemplate } from "../FwBase";
import controllerIndex from "../controller/Index";

const controller = new controllerIndex();

controller.variable();

const root = document.getElementById("jsmvcfw_app");

if (root) {
    renderTemplate(() => controller.view(), root);
}

controller.event();
