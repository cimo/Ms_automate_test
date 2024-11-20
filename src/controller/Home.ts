import { Icontroller } from "@cimo/jsmvcfw/dist/JsMvcFwInterface";
import { writeLog, variableState } from "@cimo/jsmvcfw/dist/JsMvcFw";
import CwsClient from "@cimo/websocket/dist/client/Service";

// Source
import * as HelperSrc from "../HelperSrc";
import { IvariableList } from "../model/Home";
import viewHome from "../view/Home";
import * as ModelTester from "../model/Tester";

export default class ControllerHome implements Icontroller<IvariableList> {
    // Variable
    private cwsClient: CwsClient;
    private mode: string;
    private variableList: IvariableList;

    // Method
    constructor(cwsClientValue: CwsClient, modeValue: string) {
        this.cwsClient = cwsClientValue;
        this.mode = modeValue;
        this.variableList = {} as IvariableList;

        this.broadcast();

        if (this.mode === "connection") {
            this.specFile();

            /*this.run();

            this.runLog();

            this.video();

            this.upload();*/
        }
    }

    variable(): IvariableList {
        this.variableList = {
            label: variableState<string>("label", ""),
            specFileList: variableState<string[]>("specFileList", ["aaa"])
        };

        return this.variableList;
    }

    view(variableList: IvariableList): string {
        writeLog("/controller/Home.ts - view", variableList);

        return viewHome(variableList).template;
    }

    event(variableList: IvariableList): void {
        writeLog("/controller/Home.ts - event", variableList);
    }

    destroy(variableList: IvariableList): void {
        writeLog("/controller/Home.ts - destroy", variableList);
    }

    private broadcast = (): void => {
        this.cwsClient.receiveData("broadcast", (data) => {
            if (typeof data === "string" && HelperSrc.isJson(data)) {
                /*const serverData = JSON.parse(data) as ModelTester.IserverDataBroadcast;

                if (serverData.tag === "disconnection") {
                    this.cwsClient.sendData(1, "", "user");
                    this.cwsClient.sendData(1, "", "output", 100);
                } else if (serverData.tag === "user") {
                    this.statusUser(serverData);
                } else if (serverData.tag === "output") {
                    this.statusOutput(serverData);
                }*/
            }
        });

        this.cwsClient.sendData(1, "", "specFile");
        //this.cwsClient.sendData(1, "", "user", 100);
        //this.cwsClient.sendData(1, "", "output", 200);
    };

    private specFile = (): void => {
        this.cwsClient.receiveData("specFile", (data) => {
            if (typeof data === "string") {
                const serverData = JSON.parse(data) as ModelTester.IserverData;

                this.variableList.specFileList.state = serverData.result as string[];

                this.view(this.variableList);
            }
        });
    };
}
