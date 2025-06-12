import { Icontroller } from "../JsMvcFwInterface";
import { writeLog } from "../JsMvcFw";
import { MDCDialog } from "@material/dialog";

// Source
import { IvariableList } from "../model/Alert";

export default class ControllerAlert implements Icontroller<IvariableList> {
    // Variable
    private variableList: IvariableList;
    private mdcDialog: MDCDialog | null;

    // Method
    constructor() {
        this.variableList = {} as IvariableList;
        this.mdcDialog = null;

        this.initializeHtmlElement();
    }

    variable(): IvariableList {
        return this.variableList;
    }

    view(variableList: IvariableList): string {
        writeLog("Dialog.ts => view()", variableList);

        return "";
    }

    event(variableList: IvariableList): void {
        writeLog("Dialog.ts => event()", variableList);
    }

    destroy(variableList: IvariableList): void {
        writeLog("Dialog.ts => destroy()", variableList);
    }

    private initializeHtmlElement = (): void => {
        const elementMdcDialog = document.querySelector<HTMLElement>(".mdc-dialog");

        if (elementMdcDialog) {
            this.mdcDialog = new MDCDialog(elementMdcDialog);
        }
    };

    open = (title: string, message: string, isSingleButton = false, callbackAccept?: () => void, callbackClose?: () => void) => {
        this.close();

        if (this.mdcDialog) {
            this.mdcDialog.open();

            const elementTitle = this.mdcDialog.root.querySelector<HTMLElement>(".mdc-dialog__title");
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
            }
        }
    };

    close = () => {
        if (this.mdcDialog) {
            this.mdcDialog.close();
        }
    };
}
