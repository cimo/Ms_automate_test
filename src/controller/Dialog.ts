import { MDCDialog } from "@material/dialog";

export default class ControllerDialog {
    // Variable
    private mdcDialog: MDCDialog | undefined;

    // Method
    constructor() {
        this.mdcDialog = new MDCDialog(document.querySelector<HTMLElement>(".mdc-dialog") as Element);
    }

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
