import { frameworkInit } from "../JsMvcFw";
import { routerInit } from "../JsMvcFwRouter";
import CwsClient from "@cimo/websocket/dist/client/Manager";

// Source
import * as helperSrc from "../HelperSrc";
import ControllerIndex from "../controller/Index";

const cwsClient = new CwsClient(helperSrc.WS_ADRESS);

frameworkInit(true, "jsmvcfw_app", "/");

routerInit([
    {
        title: "Index",
        path: `${helperSrc.URL_ROOT}/ui`,
        controller: () => new ControllerIndex(cwsClient)
    }
]);
