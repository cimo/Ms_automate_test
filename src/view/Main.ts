import { mainInit } from "../JsMvcFw";
import { routerInit } from "../JsMvcFwRouter";
import CwsClient from "@cimo/websocket/dist/client/Manager";

// Source
import * as HelperSrc from "../HelperSrc";
import ControllerRouter from "../controller/Router";

const cwsClient = new CwsClient(HelperSrc.WS_ADRESS);

mainInit(true, "/", "jsmvcfw_app");

const controllerRouter = new ControllerRouter(cwsClient);

routerInit(controllerRouter.dataMain);
