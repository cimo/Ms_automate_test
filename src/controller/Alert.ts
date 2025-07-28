import { Icontroller, IvirtualNode } from "../JsMvcFwInterface";
import { bindVariable } from "../JsMvcBase";
import { MDCSnackbar } from "@material/snackbar";

// Source
import * as ModelAlert from "../model/Alert";
import viewAlert from "../view/Alert";

export default class ControllerAlert implements Icontroller {
    // Variable
    private variableList: ModelAlert.IvariableList;
    private methodList: ModelAlert.ImethodList;

    private mdcSnackbar: MDCSnackbar | null;

    // Method
    private mdcView = (): void => {
        const elementMdcSnackbar = document.querySelector<HTMLElement>(".mdc-snackbar");

        if (!this.mdcSnackbar && elementMdcSnackbar) {
            this.mdcSnackbar = new MDCSnackbar(elementMdcSnackbar);

            if (this.mdcSnackbar) {
                this.mdcSnackbar.timeoutMs = -1;
            }
        }
    };

    private onClickClose = (): void => {
        this.close();
    };

    constructor() {
        this.variableList = {} as ModelAlert.IvariableList;
        this.methodList = {} as ModelAlert.ImethodList;

        this.mdcSnackbar = null;
    }

    open = (className: string, text: string, timeout = -1): void => {
        this.close();

        this.variableList.className.state = className;
        this.variableList.label.state = text;

        if (this.mdcSnackbar) {
            this.mdcSnackbar.timeoutMs = timeout;
            this.mdcSnackbar.open();
        }
    };

    close = (): void => {
        this.variableList.className.state = "";
        this.variableList.label.state = "";

        if (this.mdcSnackbar) {
            this.mdcSnackbar.close();
        }
    };

    scopeId(): string {
        return "alert";
    }

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variable()");

        this.variableList = {
            className: bindVariable("", this.scopeId()),
            label: bindVariable("", this.scopeId())
        };

        this.methodList = {
            onClickClose: this.onClickClose
        };
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => view()", this.variableList);

        this.mdcView();

        return viewAlert(this.variableList, this.methodList);
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => event()", this.variableList);
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => destroy()");
    }
}
