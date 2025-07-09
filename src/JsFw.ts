import { IvirtualNode, IvariableStateA } from "./JsFwInterface";
import { createVirtualNodeFromHTML, createElement, updateDOM } from "./JsFwDom";

let isDebug: boolean = false;
let urlRoot: string = "";
let elementRoot: HTMLElement | null = null;
let virtualNodeOld: IvirtualNode | null = null;

export const getIsDebug = () => {
    return isDebug;
};

export const getUrlRoot = () => {
    return urlRoot;
};

export const getElementRoot = () => {
    return elementRoot;
};

export const writeLog = (tag: string, value: string | string[] | Record<string, unknown> | Error): void => {
    if (isDebug) {
        // eslint-disable-next-line no-console
        console.log(`${tag} `, value);
    }
};

export function frameworkInit(isDebugValue: boolean, urlRootValue: string, elementRootValue: string) {
    isDebug = isDebugValue;
    urlRoot = urlRootValue;
    elementRoot = document.getElementById(elementRootValue);
}

export function renderTemplate(template: string) {
    const virtualNode = createVirtualNodeFromHTML(template);

    if (elementRoot) {
        if (!virtualNodeOld) {
            const element = createElement(virtualNode);

            elementRoot.appendChild(element);
        } else {
            if (elementRoot.firstElementChild) {
                updateDOM(elementRoot.firstElementChild, virtualNode, virtualNodeOld);
            }
        }
    }

    virtualNodeOld = virtualNode;
}

export function bindState<T>(target: { state: T }, template: () => string): IvariableStateA<T> {
    const listenerCallbackList: Array<(value: T) => void> = [];

    const proxy = new Proxy(target, {
        set(target, property, receiver) {
            if (property === "state") {
                target[property] = receiver;

                renderTemplate(template());

                for (const listenerCallback of listenerCallbackList) {
                    listenerCallback(receiver);
                }

                return true;
            }

            return false;
        }
    });

    return {
        get state() {
            return proxy.state;
        },
        set state(value: T) {
            proxy.state = value;
        },
        listener(callback: (value: T) => void) {
            listenerCallbackList.push(callback);
        }
    };
}
