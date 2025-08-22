import { Icontroller, IvirtualNode, variableBind } from "@cimo/jsmvcfw/dist/src/Main";
import { MDCSnackbar } from "@material/snackbar";

// Source
import * as modelAlert from "../model/Alert";
import viewAlert from "../view/Alert";

export default class Alert implements Icontroller {
    // Variable
    private variableObject: modelAlert.Ivariable;
    private methodObject: modelAlert.Imethod;

    private mdcSnackbar: MDCSnackbar | null;

    // Method
    private mdcEvent = (): void => {
        const element = this.elementHookObject.mdcSnackbar;

        if (element) {
            this.mdcSnackbar = new MDCSnackbar(element);
            this.mdcSnackbar.timeoutMs = -1;
            this.mdcSnackbar.listen("MDCSnackbar:closed", () => {
                this.variableObject.className.state = "";
                this.variableObject.label.state = "";
            });
        }
    };

    private onClickClose = (): void => {
        this.close();
    };

    constructor() {
        this.variableObject = {} as modelAlert.Ivariable;
        this.methodObject = {} as modelAlert.Imethod;

        this.mdcSnackbar = null;
    }

    open = (className: string, text: string, timeout = -1): void => {
        this.close();

        this.variableObject.className.state = className;
        this.variableObject.label.state = text;

        if (this.mdcSnackbar) {
            this.mdcSnackbar.timeoutMs = timeout;
            this.mdcSnackbar.open();
        }
    };

    close = (): void => {
        if (this.mdcSnackbar) {
            this.mdcSnackbar.close();
        }
    };

    elementHookObject = {} as modelAlert.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                className: "",
                label: ""
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
        this.mdcEvent();
    }

    destroy(): void {}
}
