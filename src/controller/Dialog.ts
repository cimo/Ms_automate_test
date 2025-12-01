import { Icontroller, IvirtualNode, variableBind } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelDialog from "../model/Dialog";
import viewDialog from "../view/Dialog";

export default class Dialog implements Icontroller {
    // Variable
    private variableObject: modelDialog.Ivariable;
    private methodObject: modelDialog.Imethod;

    private callbackAccept: (() => void) | null;
    private callbackClose: (() => void) | null;

    // Method
    private clsEvent = (): void => {
        this.elementHookObject.clsDialog.classList.add("hidden");
    };

    private onClickAccept = (): void => {
        if (this.callbackAccept) {
            this.callbackAccept();
        }

        this.close();
    };

    private onClickClose = (): void => {
        if (this.callbackClose) {
            this.callbackClose();
        }

        this.close();
    };

    constructor() {
        this.variableObject = {} as modelDialog.Ivariable;
        this.methodObject = {} as modelDialog.Imethod;

        this.callbackAccept = null;
        this.callbackClose = null;
    }

    open = (title: string, message: string, isSingleButton = false, callbackAcceptValue?: () => void, callbackCloseValue?: () => void): void => {
        this.close();

        this.variableObject.title.state = title;
        this.variableObject.content.state = message;

        this.elementHookObject.clsDialog.classList.remove("hidden");

        this.variableObject.isSingleButton.state = isSingleButton;
        this.variableObject.isOpen.state = true;

        if (callbackAcceptValue) {
            this.callbackAccept = callbackAcceptValue;
        }

        if (callbackCloseValue) {
            this.callbackClose = callbackCloseValue;
        }
    };

    close = (): void => {
        this.elementHookObject.clsDialog.classList.add("hidden");

        this.variableObject.isOpen.state = true;
    };

    elementHookObject = {} as modelDialog.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                title: "",
                content: "",
                isSingleButton: false,
                isOpen: false
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickAccept: this.onClickAccept,
            onClickClose: this.onClickClose
        };
    }

    variableEffect(): void {}

    view(): IvirtualNode {
        return viewDialog(this.variableObject, this.methodObject);
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
