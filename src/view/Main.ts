import { frameworkInit } from "../JsMvcFw";
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
]);
