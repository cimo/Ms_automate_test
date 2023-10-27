import { MDCSnackbar } from "@material/snackbar";

let element: MDCSnackbar;

export const create = () => {
    const elementMdcSnackbar = document.querySelector(".mdc-snackbar") as HTMLElement;
    element = new MDCSnackbar(elementMdcSnackbar);
    element.timeoutMs = -1;
};

export const open = (className: string, text: string, timeout = -1) => {
    close();

    element.root.classList.add(className);
    element.labelText = text;
    element.timeoutMs = timeout;
    element.open();
};

export const close = () => {
    element.close();
    element.root.classList.remove("success");
    element.root.classList.remove("error");
    element.labelText = "";
};
