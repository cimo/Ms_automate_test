import { MDCSnackbar } from "@material/snackbar";

export default class ControllerAlert {
    // Variable
    private mdcSnackbar: MDCSnackbar | null;

    // Method
    constructor() {
        this.mdcSnackbar = null;

        this.initializeHtmlElement();
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

    open = (className: string, text: string, timeout = -1): void => {
        this.close();

        if (this.mdcSnackbar) {
            this.mdcSnackbar.root.classList.add(className);
            this.mdcSnackbar.labelText = text;
            this.mdcSnackbar.timeoutMs = timeout;
            this.mdcSnackbar.open();
        }
    };

    close = (): void => {
        if (this.mdcSnackbar) {
            this.mdcSnackbar.close();
            this.mdcSnackbar.root.classList.remove("success");
            this.mdcSnackbar.root.classList.remove("error");
            this.mdcSnackbar.labelText = "";
        }
    };
}
