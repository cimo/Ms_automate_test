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
        const elementMdcSnackbar = document.querySelector<HTMLElement>(".mdc-snackbar");

        if (elementMdcSnackbar) {
            this.mdcSnackbar = new MDCSnackbar(elementMdcSnackbar);
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

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variable()");

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

    variableEffect(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variableEffect()");
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => view()", this.variableObject);

        return viewAlert(this.variableObject, this.methodObject);
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => event()", this.variableObject);
    }

    subControllerList(): Icontroller[] {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => subController()");

        const list: Icontroller[] = [];

        return list;
    }

    rendered(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => rendered()");

        this.mdcEvent();
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => destroy()");
    }
}
