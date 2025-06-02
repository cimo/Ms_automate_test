import { writeLog } from "./JsMvcFw";
import { IvariableState } from "./JsMvcFwInterface";

type CallbackMap = Map<string, Set<() => void>>;

// Map globale per tracciare i listener legati ai nomi delle variabili
const callbacks: CallbackMap = new Map();

function triggerUpdate(name: string) {
    const cbs = callbacks.get(name);
    if (cbs) {
        cbs.forEach((cb) => cb());
    }
}

export function createReactiveVariable<T>(initialValue: T, name: string): IvariableState<T> {
    let value = initialValue;

    const proxy = new Proxy(
        { val: value },
        {
            set(target, prop, newValue) {
                if (prop === "val" && target.val !== newValue) {
                    target.val = newValue;
                    triggerUpdate(name);
                    return true;
                }
                return false;
            },
            get(target, prop) {
                if (prop === "val") {
                    return target.val;
                }
                return undefined;
            }
        }
    );

    return {
        state: proxy as any,
        listener: (cb: (value: T) => void) => {
            if (!callbacks.has(name)) callbacks.set(name, new Set());
            callbacks.get(name)!.add(() => cb(proxy.val));
        }
    };
}

export const updateDataBind = (template: string, name: string): void => {
    const elementDataBindList = Array.from(document.querySelectorAll<HTMLElement>(`[data-bind="${name}"]`));

    if (elementDataBindList.length === 0) {
        writeLog("@cimo/jsmvcfw => JsMvcFwDom.ts => updateDataBind()", `The [data-bind="${name}"] are not present in the DOM!`);
        return;
    }

    const regex = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)\\s[^>]*?data-bind="${name}"[^>]*>([\\s\\S]*?)<\\/\\1>`, "g");
    const matchList = [...template.matchAll(regex)];

    for (const [elementKey, elementValue] of Object.entries(elementDataBindList)) {
        const match = matchList[elementKey];
        elementValue.outerHTML = match ? match[0] : "";
    }
};
