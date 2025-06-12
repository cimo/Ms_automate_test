import { writeLog } from "./JsMvcFw";

export const updateDataBind = (template: string, name: string): void => {
    const elementDataBind = document.querySelector<HTMLElement>(`[data-bind="${name}"]`);

    if (elementDataBind) {
        const regex = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)\\s[^>]*?data-bind="${name}"[^>]*>([\\s\\S]*?)<\\/\\1>`, "g");

        const match = template.match(regex);

        elementDataBind.innerHTML = match ? match[0] : "";
    } else {
        writeLog("@cimo/jsmvcfw => JsMvcFwDom.ts => updateDataBind()", `data-bind="${name}" don't exists in the DOM!`);
    }
};
