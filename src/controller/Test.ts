import { IcontrollerA } from "../JsFwInterface";
import { writeLog, bindState } from "../JsFw";

// Source
import { IvariableListA } from "../model/Test";
import viewTest from "../view/Test";

export default class ControllerTest implements IcontrollerA {
    // Variable
    private template: () => string;
    private variableList: IvariableListA;
    private elementButton: HTMLButtonElement | null;

    // Method
    constructor() {
        this.template = () => viewTest(this.variableList);
        this.variableList = {} as IvariableListA;
        this.elementButton = null;
    }

    variable(): void {
        this.variableList = {
            count: bindState({ state: 0 }, this.template),
            list: bindState({ state: ["uno", "due"] }, this.template)
        };
    }

    view(): () => string {
        writeLog("Test.ts => view()", this.variableList);

        return this.template;
    }

    event(): void {
        writeLog("Test.ts => event()", this.variableList);

        this.elementButton = document.getElementById("btn") as HTMLButtonElement;

        if (this.elementButton) {
            this.elementButton.addEventListener("click", (e) => {
                const target = e.target as HTMLElement;

                if (target) {
                    this.variableList.count.state++;
                    this.variableList.list.state = ["uno", "due", "tre"];
                }
            });
        }

        this.variableList.list.listener((value) => {
            writeLog("Test.ts => event()  => listener()", value);
        });
    }

    destroy(): void {
        writeLog("Test.ts => destroy()", this.variableList);
    }
}
