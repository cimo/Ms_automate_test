import { Icontroller, IvirtualNode } from "../JsMvcFwInterface";
import { variableBind } from "../JsMvcFw";
import { MDCSnackbar } from "@material/snackbar";

// Source
import * as ModelAlert from "../model/Alert";
import viewAlert from "../view/Alert";

export default class ControllerAlert implements Icontroller {
    // Variable
    private variableList: ModelAlert.Ivariable;
    private methodList: ModelAlert.Imethod;

    private mdcSnackbar: MDCSnackbar | null;

    // Method
    private mdcEvent = (): void => {
        const elementMdcSnackbar = document.querySelector<HTMLElement>(".mdc-snackbar");

        if (elementMdcSnackbar) {
            this.mdcSnackbar = new MDCSnackbar(elementMdcSnackbar);
            this.mdcSnackbar.timeoutMs = -1;
            this.mdcSnackbar.listen("MDCSnackbar:closed", () => {
                this.variableList.className.state = "";
                this.variableList.label.state = "";
            });
        }
    };

    private onClickClose = (): void => {
        this.close();
    };

    constructor() {
        this.variableList = {} as ModelAlert.Ivariable;
        this.methodList = {} as ModelAlert.Imethod;

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
        if (this.mdcSnackbar) {
            this.mdcSnackbar.close();
        }
    };

    getName(): string {
        return "alert";
    }

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variable()");

        this.variableList = variableBind(
            {
                className: "",
                label: ""
            },
            this.getName()
        );

        this.methodList = {
            onClickClose: this.onClickClose
        };
    }

    variableLoaded(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variableLoaded()");

        this.mdcEvent();
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => view()", this.variableList);

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

    subControllerList(): Icontroller[] {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => subController()");

        const list: Icontroller[] = [];

        return list;
    }
}
