import { Icontroller } from "../jsmvcfw/JsMvcFwInterface";
import { writeLog } from "../jsmvcfw/JsMvcFw";
import { MDCSnackbar } from "@material/snackbar";

// Source
import { IvariableList } from "../model/Alert";

export default class ControllerAlert implements Icontroller<IvariableList> {
    // Variable
    private variableList: IvariableList;
    private mdcSnackbar: MDCSnackbar | null;

    // Method
    constructor() {
        this.variableList = {} as IvariableList;
        this.mdcSnackbar = null;

        this.initializeHtmlElement();
    }

    variable(): IvariableList {
        return this.variableList;
    }

    view(variableList: IvariableList): string {
        writeLog("Alert.ts => view()", variableList);

        return "";
    }

    event(variableList: IvariableList): void {
        writeLog("Alert.ts => event()", variableList);
    }

    destroy(variableList: IvariableList): void {
        writeLog("Alert.ts => destroy()", variableList);
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

    open = (className: string, text: string, timeout = -1) => {
        this.close();

        if (this.mdcSnackbar) {
            this.mdcSnackbar.root.classList.add(className);
            this.mdcSnackbar.labelText = text;
            this.mdcSnackbar.timeoutMs = timeout;
            this.mdcSnackbar.open();
        }
    };

    close = () => {
        if (this.mdcSnackbar) {
            this.mdcSnackbar.close();
            this.mdcSnackbar.root.classList.remove("success");
            this.mdcSnackbar.root.classList.remove("error");
            this.mdcSnackbar.labelText = "";
        }
    };
}
