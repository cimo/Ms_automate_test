import { Icontroller, IvirtualNode, variableBind } from "@cimo/jsmvcfw/dist/src/Main";
import { MDCDialog } from "@material/dialog";

// Source
import * as modelDialog from "../model/Dialog";
import viewDialog from "../view/Dialog";

export default class Dialog implements Icontroller {
    // Variable
    private variableObject: modelDialog.Ivariable;
    private methodObject: modelDialog.Imethod;

    private mdcDialog: MDCDialog | null;
    private callbackAccept: (() => void) | null;
    private callbackClose: (() => void) | null;

    // Method
    private mdcEvent = (): void => {
        const elementMdcDialog = document.querySelector<HTMLElement>(".mdc-dialog");

        if (elementMdcDialog) {
            this.mdcDialog = new MDCDialog(elementMdcDialog);
            this.mdcDialog.listen("MDCDialog:closed", () => {
                this.variableObject.title.state = "";
                this.variableObject.content.state = "";
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
        this.variableObject = {} as modelDialog.Ivariable;
        this.methodObject = {} as modelDialog.Imethod;

        this.mdcDialog = null;
        this.callbackAccept = null;
        this.callbackClose = null;
    }

    open = (title: string, message: string, isSingleButton = false, callbackAcceptValue?: () => void, callbackCloseValue?: () => void): void => {
        this.close();

        this.variableObject.title.state = title;
        this.variableObject.content.state = message;

        if (this.mdcDialog) {
            this.mdcDialog.open();

            this.variableObject.isSingleButton.state = isSingleButton;

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

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => variable()");

        this.variableObject = variableBind(
            {
                title: "",
                content: "",
                isSingleButton: false
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickAccept: this.onClickAccept,
            onClickClose: this.onClickClose
        };
    }

    variableEffect(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => variableEffect()");
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => view()", this.variableObject);

        return viewDialog(this.variableObject, this.methodObject);
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => event()", this.variableObject);
    }

    subControllerList(): Icontroller[] {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => subController()");

        const list: Icontroller[] = [];

        return list;
    }

    rendered(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => rendered()");

        this.mdcEvent();
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => destroy()");
    }
}
