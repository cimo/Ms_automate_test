import { renderTemplate, reactive } from "../JsFw";
import { IcontrollerA } from "../JsFwInterface";

// Source
import { IvariableListA } from "../model/Test";
import viewTest from "../view/Test";

export default class ControllerTest implements IcontrollerA {
    // Variable
    private variableList: IvariableListA;

    // Method
    constructor() {
        this.variableList = {} as IvariableListA;
    }

    variable(): void {
        this.variableList = {
            count: reactive({ state: 0 }, this.renderComponent),
            list: reactive({ state: ["uno", "due"] }, this.renderComponent)
        };
    }

    view(): void {
        // eslint-disable-next-line no-console
        console.log("Test.ts => view()", this.variableList);

        this.renderComponent();
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Test.ts => event()", this.variableList);

        document.getElementById("btn")!.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target) {
                this.variableList.count.state++;
                this.variableList.list.state = ["uno", "due", "tre"];
            }
        });

        this.variableList.list.listener((value) => {
            // eslint-disable-next-line no-console
            console.log("Test.ts => event() => listener", value);
        });
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Test.ts => destroy()", this.variableList);
    }

    renderComponent = () => {
        const { template } = viewTest(this.variableList);
        renderTemplate(template);
    };
}
