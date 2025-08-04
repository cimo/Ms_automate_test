import { Icontroller, IvirtualNode } from "../JsMvcFwInterface";
import { variableBind } from "../JsMvcFw";
import { MDCDialog } from "@material/dialog";

// Source
import * as ModelDialog from "../model/Dialog";
import viewDialog from "../view/Dialog";

export default class ControllerDialog implements Icontroller {
    // Variable
    private variableList: ModelDialog.IvariableList;
    private methodList: ModelDialog.ImethodList;

    private mdcDialog: MDCDialog | null;
    private callbackAccept: (() => void) | null;
    private callbackClose: (() => void) | null;

    // Method
    private mdcEvent = (): void => {
        const elementMdcDialog = document.querySelector<HTMLElement>(".mdc-dialog");

        if (elementMdcDialog) {
            this.mdcDialog = new MDCDialog(elementMdcDialog);
            this.mdcDialog.listen("MDCDialog:closed", () => {
                this.variableList.title.state = "";
                this.variableList.content.state = "";
            });
        }
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
        this.variableList = {} as ModelDialog.IvariableList;
        this.methodList = {} as ModelDialog.ImethodList;

        this.mdcDialog = null;
        this.callbackAccept = null;
        this.callbackClose = null;
    }

    open = (title: string, message: string, isSingleButton = false, callbackAcceptValue?: () => void, callbackCloseValue?: () => void): void => {
        this.close();

        this.variableList.title.state = title;
        this.variableList.content.state = message;

        if (this.mdcDialog) {
            this.mdcDialog.open();

            this.variableList.isSingleButton.state = isSingleButton;

            if (callbackAcceptValue) {
                this.callbackAccept = callbackAcceptValue;
            }

            if (callbackCloseValue) {
                this.callbackClose = callbackCloseValue;
            }
        }
    };

    close = (): void => {
        if (this.mdcDialog) {
            this.mdcDialog.close();
        }
    };

    name(): string {
        return "dialog";
    }

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => variable()");

        this.variableList = {
            title: variableBind("", this.name()),
            content: variableBind("", this.name()),
            isSingleButton: variableBind(false, this.name())
        };

        this.methodList = {
            onClickAccept: this.onClickAccept,
            onClickClose: this.onClickClose
        };
    }

    variableLoaded(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => variableLoaded()");

        this.mdcEvent();
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => view()", this.variableList);

        return viewDialog(this.variableList, this.methodList);
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => event()", this.variableList);
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => destroy()");
    }

    subControllerList(): Icontroller[] {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => subController()");

        const list: Icontroller[] = [];

        return list;
    }
}
