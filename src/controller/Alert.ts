import { Icontroller, IvirtualNode, variableBind } from "@cimo/jsmvcfw/dist/src/Main";
import { MDCSnackbar } from "@material/snackbar";

// Source
import * as modelAlert from "../model/Alert";
import viewAlert from "../view/Alert";

export default class Alert implements Icontroller {
    // Variable
    private variableList: modelAlert.Ivariable;
    private methodList: modelAlert.Imethod;

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
        this.variableList = {} as modelAlert.Ivariable;
        this.methodList = {} as modelAlert.Imethod;

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

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variable()");

        this.variableList = variableBind(
            {
                className: "",
                label: ""
            },
            this.constructor.name
        );

        this.methodList = {
            onClickClose: this.onClickClose
        };
    }

    variableEffect(): void {
        // eslint-disable-next-line no-console
        console.log("Alert.ts => variableEffect()");
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
