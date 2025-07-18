import { Icontroller, IvirtualNode } from "../JsMvcFwInterface";
import { bindVariable } from "../JsMvcBase";
import { MDCDialog } from "@material/dialog";

// Source
import * as ModelDialog from "../model/Dialog";
import viewDialog from "../view/Dialog";

export default class ControllerDialog implements Icontroller {
    // Variable
    private variableList: ModelDialog.IvariableList;
    private methodList: ModelDialog.ImethodList;

    private mdcDialog: MDCDialog | null;

    // Method
    private mdcView = (): void => {
        const elementMdcDialog = document.querySelector<HTMLElement>(".mdc-dialog");

        if (!this.mdcDialog && elementMdcDialog) {
            this.mdcDialog = new MDCDialog(elementMdcDialog);
        }
    };

    private onClickAccept = (): void => {
        this.close();
    };

    private onClickClose = (): void => {
        this.close();
    };

    constructor() {
        this.variableList = {} as ModelDialog.IvariableList;
        this.methodList = {} as ModelDialog.ImethodList;

        this.mdcDialog = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open = (title: string, message: string, isSingleButton = false, callbackAccept?: () => void, callbackClose?: () => void): void => {
        this.close();

        this.variableList.title.state = title;
        this.variableList.content.state = message;

        if (this.mdcDialog) {
            this.mdcDialog.open();

            /*const elementTitle = this.mdcDialog.root.querySelector<HTMLElement>(".mdc-dialog__title");
            const elementContent = this.mdcDialog.root.querySelector<HTMLElement>(".mdc-dialog__content");
            const elementAction = this.mdcDialog.root.querySelector<HTMLElement>(".mdc-dialog__actions");

            if (elementTitle && elementContent && elementAction) {
                elementTitle.innerHTML = title;
                elementContent.innerHTML = message;

                const elementButtonAccept = elementAction.querySelector<HTMLButtonElement>("[data-mdc-dialog-action=accept]");
                const elementButtonClose = elementAction.querySelector<HTMLButtonElement>("[data-mdc-dialog-action=close]");

                if (elementButtonAccept && elementButtonClose) {
                    elementButtonAccept.onclick = () => {
                        if (callbackAccept) {
                            callbackAccept();
                        }
                    };

                    elementButtonClose.onclick = () => {
                        if (callbackClose) {
                            callbackClose();
                        }
                    };

                    if (isSingleButton) {
                        elementButtonClose.style.setProperty("display", "none", "important");
                    }
                }
            }*/
        }
    };

    close = (): void => {
        this.variableList.title.state = "";
        this.variableList.content.state = "";

        if (this.mdcDialog) {
            this.mdcDialog.close();
        }
    };

    variable(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => variable()");

        this.variableList = {
            title: bindVariable(""),
            content: bindVariable("")
        };

        this.methodList = {
            onClickAccept: this.onClickAccept,
            onClickClose: this.onClickClose
        };
    }

    view(): IvirtualNode {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => view()", this.variableList);

        this.mdcView();

        return viewDialog(this.variableList, this.methodList);
    }

    event(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => event()", this.variableList);
    }

    destroy(): void {
        // eslint-disable-next-line no-console
        console.log("Dialog.ts => destroy()");
    }
}
