import { Icontroller, IvirtualNode } from "../JsMvcFwInterface";
import { writeLog, bindVariableState } from "../JsMvcBase";
import { MDCSnackbar } from "@material/snackbar";

// Source
import * as ModelAlert from "../model/Alert";
import viewAlert from "../view/Alert";

export default class ControllerAlert implements Icontroller {
    // Variable
    private template: () => IvirtualNode;
    private variableList: ModelAlert.IvariableList;

    private mdcSnackbar: MDCSnackbar | null;

    // Method
    constructor() {
        this.template = () => viewAlert(this.variableList);
        this.variableList = {} as ModelAlert.IvariableList;

        this.mdcSnackbar = null;
    }

    private initializeMdc = (): void => {
        const elementMdcSnackbar = document.querySelector<HTMLElement>(".mdc-snackbar");

        if (elementMdcSnackbar) {
            this.mdcSnackbar = new MDCSnackbar(elementMdcSnackbar);

            if (this.mdcSnackbar) {
                this.mdcSnackbar.timeoutMs = -1;
            }
        }
    };

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

    variable(): void {
        this.variableList = {
            className: bindVariableState({ state: "" }, this.template, "subViewAlert", this.initializeMdc),
            label: bindVariableState({ state: "" }, this.template, "subViewAlert", this.initializeMdc)
        };
    }

    view(): IvirtualNode {
        writeLog("Alert.ts => view()", this.variableList);

        return this.template();
    }

    event(): void {
        writeLog("Alert.ts => event()", this.variableList);
    }

    destroy(): void {
        writeLog("Alert.ts => destroy()", this.variableList);
    }
}
