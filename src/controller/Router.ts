import { Irouter, Icontroller } from "@cimo/jsmvcfw/dist/JsMvcFwInterface";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import ControllerIndex from "./Index";

export default class ControllerRouter {
    // Variable
    public dataMain: Irouter[];

    // Method
    constructor(cwsClient: CwsClient) {
        this.dataMain = [
            {
                title: "Index",
                path: "/",
                controller: () => new ControllerIndex(cwsClient) as unknown as Icontroller
            }
        ];
    }
}
