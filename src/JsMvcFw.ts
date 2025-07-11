/*
import { IvirtualNode, IvariableState, ImethodState } from "./JsMvcFwInterface";
import { createVirtualNodeFromHTML, createElement, updateDOM } from "./JsMvcFwDom";

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

export function bindState<T>(data: { state: T }, template: () => string): IvariableState<T> {
    const listenerCallbackList: Array<(value: T) => void> = [];

    const proxy = new Proxy(data, {
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

export function bindMethod<Args extends unknown[], Return>(
    data: { state: (...value: Args) => Return },
    template: () => string
): ImethodState<Args, Return> {
    const listenerCallbackList: Array<(...value: Args) => void> = [];

    return {
        state: (...value: Args): Return => {
            for (const listenerCallback of listenerCallbackList) {
                listenerCallback(...value);
            }

            const result = data.state(...value);

            renderTemplate(template());

            return result;
        },
        listener(callback: (...value: Args) => void): void {
            listenerCallbackList.push(callback);
        }
    };
}
*/

import { IvariableState, IvirtualNode } from "./JsMvcFwInterface";
import { updateDOM, createElement } from "./JsMvcFwDom";

let isDebug = false;
let urlRoot = "";
let elementRoot: HTMLElement | null = null;
let virtualNodeOld: IvirtualNode | null = null;

export const getIsDebug = () => isDebug;
export const getUrlRoot = () => urlRoot;
export const getElementRoot = () => elementRoot;

export const writeLog = (tag: string, value: any): void => {
    if (isDebug) {
        // eslint-disable-next-line no-console
        console.log(`${tag} `, value);
    }
};

export function frameworkInit(isDebugValue: boolean, urlRootValue: string, elementRootId: string) {
    isDebug = isDebugValue;
    urlRoot = urlRootValue;
    elementRoot = document.getElementById(elementRootId);
}

export function renderTemplate(template: () => IvirtualNode) {
    const virtualNode = template();

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

export function bindState<T>(data: { state: T }, template: () => IvirtualNode): IvariableState<T> {
    const listeners: Array<(value: T) => void> = [];

    const proxy = new Proxy(data, {
        set(target, prop, value) {
            if (prop === "state") {
                target[prop as keyof typeof target] = value;
                renderTemplate(template);
                listeners.forEach((cb) => cb(value));
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
            listeners.push(callback);
        }
    };
}
