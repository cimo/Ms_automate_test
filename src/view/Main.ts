import { mainInit } from "@cimo/jsmvcfw/dist/JsMvcFw";
import { routerInit } from "@cimo/jsmvcfw/dist/JsMvcFwRouter";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import * as HelperSrc from "../HelperSrc";
import ControllerRouter from "../controller/Router";

const cwsClient = new CwsClient(HelperSrc.WS_ADRESS);

mainInit(true, "/", "jsmvcfw_app");

const controllerRouter = new ControllerRouter(cwsClient);

routerInit(controllerRouter.dataMain);
