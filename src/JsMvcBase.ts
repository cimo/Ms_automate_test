import { IvirtualNode, IbindVariable } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let elementRoot: HTMLElement | null = null;
let urlRoot = "";

const renderExecuteMap = new Map<string, () => void>();
const stateVariableMap = new Map<string, any>();

export const getIsDebug = () => isDebug;
export const getElementRoot = () => elementRoot;
export const getUrlRoot = () => urlRoot;

export const frameworkInit = (isDebugValue: boolean, elementRootId: string, urlRootValue: string): void => {
    isDebug = isDebugValue;
    elementRoot = document.getElementById(elementRootId);
    urlRoot = urlRootValue;
};

export function renderTemplate(virtualNode: () => IvirtualNode, scopeId: string): void {
    let virtualNodeOld: IvirtualNode | null = null;

    const renderExecute = () => {
        const virtualNodeNew = virtualNode();

        if (!elementRoot) {
            throw new Error("JsMvcBase.ts => Element root not found!");
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

    renderExecuteMap.set(scopeId, renderExecute);
    renderExecute();
}

export function bindVariable<T>(initial: T, scopeId: string): IbindVariable<T> {
    let _state = initial;
    let _listener: ((value: T) => void) | null = null;

    return {
        get state(): T {
            return _state;
        },
        set state(val: T) {
            _state = val;

            if (_listener) _listener(val);

            const renderExecute = renderExecuteMap.get(scopeId);
            if (renderExecute) {
                renderExecute();
            }
        },
        listener(callback: (value: T) => void): void {
            _listener = callback;
        }
    };
}

export function stateVariable<T>(initial: T, scopeId: string): [T, (val: T) => void] {
    if (!stateVariableMap.has(scopeId)) {
        stateVariableMap.set(scopeId, initial);
    }

    const setState = (val: T) => {
        stateVariableMap.set(scopeId, val);

        const renderExecute = renderExecuteMap.get(scopeId);
        if (renderExecute) {
            renderExecute();
        }
    };

    return [stateVariableMap.get(scopeId), setState];
}
