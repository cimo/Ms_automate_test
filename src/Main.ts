import { frameworkInit, routerInit } from "@cimo/jsmvcfw/dist/src/Main";
import CwsClient from "@cimo/websocket/dist/src/client/Manager";

// Source
import * as helperSrc from "./HelperSrc";
import ControllerIndex from "./controller/Index";

const cwsClient = new CwsClient(helperSrc.WS_ADRESS);

frameworkInit(true, "jsmvcfw_app", "/");

routerInit([
    {
        title: "Index",
        path: `${helperSrc.URL_ROOT}/ui`,
        controller: () => new ControllerIndex(cwsClient)
    }
]);
