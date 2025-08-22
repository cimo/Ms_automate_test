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
        const element = this.elementHookObject.mdcDialog;

        if (element) {
            this.mdcDialog = new MDCDialog(element);
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

    elementHookObject = {} as modelDialog.IelementHook;

    variable(): void {
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
        this.mdcEvent();
    }

    destroy(): void {}
}
