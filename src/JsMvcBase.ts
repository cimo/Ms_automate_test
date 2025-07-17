import { IvariableState, IvirtualNode } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let urlRoot = "";
let elementRoot: HTMLElement | null = null;
let virtualNodeOld: IvirtualNode | null = null;
const subViewMap = new Map<string, { element: Element | null; oldNode: IvirtualNode | null }>();

const renderSubView = (template: () => IvirtualNode, id: string): void => {
    const virtualNode = template();
    const container = document.getElementById(id);

    if (!container) {
        writeLog("renderSubView => container not found", id);

        return;
    }

    const currentElement = container.firstElementChild;
    const subView = subViewMap.get(id);

    if (!currentElement || !subView) {
        const element = createVirtualNode(virtualNode);
        container.innerHTML = "";
        container.appendChild(element);
        subViewMap.set(id, { element, oldNode: virtualNode });
    } else {
        updateVirtualNode(currentElement, virtualNode, subView.oldNode!);
        subViewMap.set(id, { element: currentElement, oldNode: virtualNode });
    }
};

export const getIsDebug = () => isDebug;
export const getUrlRoot = () => urlRoot;
export const getElementRoot = () => elementRoot;

export const writeLog = (tag: string, value: unknown): void => {
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

export const bindVariableState = <T>(data: { state: T }, template: () => IvirtualNode, id?: string, callback?: () => void): IvariableState<T> => {
    const listenerList: Array<(value: T) => void> = [];

    const proxy = new Proxy(data, {
        set(target, property, receiver) {
            if (property === "state") {
                target[property] = receiver;

                if (!id) {
                    renderTemplate(template);
                } else {
                    renderSubView(template, id);
                }

                if (callback) {
                    callback();
                }

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
