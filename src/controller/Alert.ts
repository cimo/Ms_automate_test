import { MDCSnackbar } from "@material/snackbar";

export default class ControllerAlert {
    // Variable
    private mdcSnackbar: MDCSnackbar | undefined;

    // Method
    constructor() {
        this.mdcSnackbar = new MDCSnackbar(document.querySelector<HTMLElement>(".mdc-snackbar") as Element);

        if (this.mdcSnackbar) {
            this.mdcSnackbar.timeoutMs = -1;
        }
    }

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
