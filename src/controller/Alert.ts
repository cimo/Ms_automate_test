import { Icontroller, IvirtualNode, variableBind } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelAlert from "../model/Alert";
import viewAlert from "../view/Alert";

export default class Alert implements Icontroller {
    // Variable
    private variableObject: modelAlert.Ivariable;
    private methodObject: modelAlert.Imethod;

    private timeout: NodeJS.Timeout | null;

    // Method
    private clsEvent = (): void => {
        this.elementHookObject.clsAlert.classList.add("hidden");
    };

    private onClickClose = (): void => {
        this.close();
    };

    constructor() {
        this.variableObject = {} as modelAlert.Ivariable;
        this.methodObject = {} as modelAlert.Imethod;

        this.timeout = null;
    }

    open = (className: string, text: string, timeout = -1): void => {
        this.close();

        this.elementHookObject.clsAlert.classList.remove("hidden");

        this.variableObject.className.state = className;
        this.variableObject.label.state = text;
        this.variableObject.isOpen.state = true;

        if (timeout > 0) {
            this.timeout = setTimeout(() => {
                this.close();
            }, timeout);
        }
    };

    close = (): void => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.elementHookObject.clsAlert.classList.add("hidden");

        this.variableObject.isOpen.state = false;
    };

    elementHookObject = {} as modelAlert.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                className: "",
                label: "",
                isOpen: false
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickClose: this.onClickClose
        };
    }

    variableEffect(): void {}

    view(): IvirtualNode {
        return viewAlert(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const list: Icontroller[] = [];

        return list;
    }

    rendered(): void {
        this.clsEvent();
    }

    destroy(): void {}
}
