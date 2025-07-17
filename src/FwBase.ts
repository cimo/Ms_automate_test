import { IvirtualNode, IvariableState } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let currentState: any;
let setStateCallback: () => void;

export function useState<T>(initial: T): [T, (val: T) => void] {
    if (currentState === undefined) {
        currentState = initial;
    }

    const setState = (val: T) => {
        currentState = val;
        if (setStateCallback) setStateCallback();
    };

    return [currentState, setState];
}

export function bindVariable<T>(initial: T): IvariableState<T> {
    let _state = initial;
    let _listener: ((value: T) => void) | null = null;

    return {
        get state(): T {
            return _state;
        },
        set state(val: T) {
            _state = val;
            if (_listener) _listener(val);
            if (setStateCallback) setStateCallback();
        },
        listener(callback: (value: T) => void): void {
            _listener = callback;
        }
    };
}

export function renderTemplate(component: () => IvirtualNode, root: HTMLElement): void {
    let oldVNode: IvirtualNode | null = null;

    setStateCallback = () => {
        const newVNode = component();

        if (!oldVNode) {
            const el = createVirtualNode(newVNode);
            root.innerHTML = "";
            root.appendChild(el);
        } else {
            const rootChild = root.firstElementChild;

            if (rootChild) {
                updateVirtualNode(rootChild, newVNode, oldVNode);
            }
        }

        oldVNode = newVNode;
    };

    setStateCallback();
}
