import { Irouter, Icontroller } from "@cimo/jsmvcfw/dist/JsMvcFwInterface";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import ControllerHome from "./Home";

export default class ControllerRouter {
    // Variable
    public dataMain: Irouter[];

    // Method
    constructor(cwsClient: CwsClient, mode: string) {
        this.dataMain = [
            {
                title: "HOME",
                path: "/",
                controller: () => new ControllerHome(cwsClient, mode) as unknown as Icontroller
            }
        ];
    }
}
