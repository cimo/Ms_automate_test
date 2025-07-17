import { IvirtualNode, IbindVariable } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let elementRoot: HTMLElement | null = null;
let urlRoot = "";

let stateVariableCurrent: any;
let renderExecute: () => void;

export const getIsDebug = () => isDebug;
export const getElementRoot = () => elementRoot;
export const getUrlRoot = () => urlRoot;

export const frameworkInit = (isDebugValue: boolean, elementRootId: string, urlRootValue: string): void => {
    isDebug = isDebugValue;
    elementRoot = document.getElementById(elementRootId);
    urlRoot = urlRootValue;
};

export function renderTemplate(virtualNode: () => IvirtualNode): void {
    let virtualNodeOld: IvirtualNode | null = null;

    renderExecute = () => {
        const virtualNodeNew = virtualNode();

        if (!elementRoot) {
            throw new Error("JsMvcFwBase.ts => Element root not found!");
        }

        if (!virtualNodeOld) {
            const elementVirtualNode = createVirtualNode(virtualNodeNew);

            elementRoot.innerHTML = "";
            elementRoot.appendChild(elementVirtualNode);
        } else {
            const rootChild = elementRoot.firstElementChild;

            if (rootChild) {
                updateVirtualNode(rootChild, virtualNodeOld, virtualNodeNew);
            }
        }

        virtualNodeOld = virtualNodeNew;
    };

    renderExecute();
}

export function bindVariable<T>(initial: T): IbindVariable<T> {
    let _state = initial;
    let _listener: ((value: T) => void) | null = null;

    return {
        get state(): T {
            return _state;
        },
        set state(val: T) {
            _state = val;

            if (_listener) _listener(val);

            if (renderExecute) {
                renderExecute();
            }
        },
        listener(callback: (value: T) => void): void {
            _listener = callback;
        }
    };
}

export function stateVariable<T>(initial: T): [T, (val: T) => void] {
    if (stateVariableCurrent === undefined) {
        stateVariableCurrent = initial;
    }

    const setState = (val: T) => {
        stateVariableCurrent = val;

        if (renderExecute) {
            renderExecute();
        }
    };

    return [stateVariableCurrent, setState];
}
