import { IvariableState, IvirtualNode } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

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

export const frameworkInit = (isDebugValue: boolean, urlRootValue: string, elementRootId: string): void => {
    isDebug = isDebugValue;
    urlRoot = urlRootValue;
    elementRoot = document.getElementById(elementRootId);
};

export const renderTemplate = (template: () => IvirtualNode): void => {
    const virtualNode = template();

    if (elementRoot) {
        if (!virtualNodeOld) {
            const element = createVirtualNode(virtualNode);

            elementRoot.appendChild(element);
        } else {
            if (elementRoot.firstElementChild) {
                updateVirtualNode(elementRoot.firstElementChild, virtualNode, virtualNodeOld);
            }
        }
    }

    virtualNodeOld = virtualNode;
};

export const bindVariableState = <T>(data: { state: T }, template: () => IvirtualNode): IvariableState<T> => {
    const listenerList: Array<(value: T) => void> = [];

    const proxy = new Proxy(data, {
        set(target, property, receiver) {
            if (property === "state") {
                target[property] = receiver;

                renderTemplate(template);

                for (const listener of listenerList) {
                    listener(receiver);
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
            listenerList.push(callback);
        }
    };
};
