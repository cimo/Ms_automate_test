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

    private initializeHtmlElement = (): void => {
        const elementMdcSnackbar = document.querySelector<HTMLElement>(".mdc-snackbar");

        if (elementMdcSnackbar) {
            this.mdcSnackbar = new MDCSnackbar(elementMdcSnackbar);

            if (this.mdcSnackbar) {
                this.mdcSnackbar.timeoutMs = -1;
            }
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open = (className: string, text: string, timeout = -1): void => {
        /*this.close();

        if (this.mdcSnackbar) {
            this.mdcSnackbar.root.classList.add(className);
            this.mdcSnackbar.labelText = text;
            this.mdcSnackbar.timeoutMs = timeout;
            this.mdcSnackbar.open();
        }*/

        this.variableList.test.state = text;

        //if (this.mdcSnackbar) {
        //this.mdcSnackbar.open();
        //}
    };

    close = (): void => {
        if (this.mdcSnackbar) {
            this.mdcSnackbar.close();
            this.mdcSnackbar.root.classList.remove("success");
            this.mdcSnackbar.root.classList.remove("error");
            this.mdcSnackbar.labelText = "";
        }
    };

    variable(): void {
        this.variableList = {
            test: bindVariableState({ state: "" }, this.template)
        };
    }

    view(): IvirtualNode {
        writeLog("Alert.ts => view()", this.variableList);

        return this.template();
    }

    event(): void {
        writeLog("Alert.ts => event()", this.variableList);

        this.initializeHtmlElement();
    }

    destroy(): void {
        writeLog("Alert.ts => destroy()", this.variableList);
    }
}
