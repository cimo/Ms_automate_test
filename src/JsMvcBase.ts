import { IvirtualNode, IbindVariable, Icontroller } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let elementRoot: HTMLElement | null = null;
let urlRoot = "";

const virtualNodeList: Record<string, IvirtualNode | null> = {};
const executeRenderTemplateList: Record<string, () => void> = {};
const stateVariableList: Record<string, unknown> = {};

export const getIsDebug = () => isDebug;
export const getElementRoot = () => elementRoot;
export const getUrlRoot = () => urlRoot;

export const frameworkInit = (
    isDebugValue: boolean,
    elementRootId: string,
    urlRootValue: string
): void => {
    isDebug = isDebugValue;
    elementRoot = document.getElementById(elementRootId);
    urlRoot = urlRootValue;
};

export function renderTemplate(controller: Icontroller, controllerParent?: Icontroller): void {
    const controllerName = controller.name();

    const executeRenderTemplate = () => {
        const virtualNodeNew = controller.view();

        let elementContainer: Element | null = null;

        if (!controllerParent) {
            if (!elementRoot) {
                throw new Error("JsMvcBase.ts => Root element #jsmvcfw_app not found!");
            }

            elementContainer = elementRoot;
        } else {
            const parentContainer = document.querySelector(`[data-jsmvcfw-controllerName="${controllerParent.name()}"]`);

            if (!parentContainer) {
                throw new Error(`JsMvcBase.ts => Tag data-jsmvcfw-controllerName="${controllerParent.name()}" not found!`);
            }

            elementContainer = parentContainer.querySelector(`[data-jsmvcfw-controllerName="${controllerName}"]`);

            if (!elementContainer) {
                throw new Error(`JsMvcBase.ts => Tag data-jsmvcfw-controllerName="${controllerName}" not found inside data-jsmvcfw-controllerName="${controllerParent.name()}"!`);
            }
        }

        const virtualNodeOld = virtualNodeList[controllerName];

        if (!virtualNodeOld) {
            const elementVirtualNode = createVirtualNode(virtualNodeNew);

            elementContainer.innerHTML = "";
            elementContainer.appendChild(elementVirtualNode);
        } else {
            const elementFirstChild = elementContainer.firstElementChild;

            if (elementFirstChild) {
                updateVirtualNode(elementFirstChild, virtualNodeOld, virtualNodeNew);
            }
        }

        virtualNodeList[controllerName] = virtualNodeNew;
    };

    executeRenderTemplateList[controllerName] = executeRenderTemplate;

    executeRenderTemplate();

    if (controller.subControllerList) {
        const subControllerList = controller.subControllerList();

        for (const subController of subControllerList) {
            renderTemplate(subController, controller);
        }
    }
}

export function bindVariable<T>(stateValue: T, controllerName: string): IbindVariable<T> {
    let _state = stateValue;
    let _listener: ((value: T) => void) | null = null;

    const triggerUpdate = () => {
        if (_listener) _listener(_state);
        const executeRenderTemplate = executeRenderTemplateList[controllerName];
        if (executeRenderTemplate) executeRenderTemplate();
    };

    const wrapWithProxy = (value: any): any => {
        if (typeof value !== 'object' || value === null) return value;

        return new Proxy(value, {
            get(target, prop, receiver) {
                const result = Reflect.get(target, prop, receiver);
                return typeof result === 'object' && result !== null
                    ? wrapWithProxy(result)
                    : result;
            },
            set(target, prop, newValue, receiver) {
                const result = Reflect.set(target, prop, newValue, receiver);
                triggerUpdate();
                return result;
            },
            deleteProperty(target, prop) {
                const result = Reflect.deleteProperty(target, prop);
                triggerUpdate();
                return result;
            }
        });
    };

    _state = wrapWithProxy(_state);

    return {
        get state(): T {
            return _state;
        },
        set state(value: T) {
            _state = wrapWithProxy(value);
            triggerUpdate();
        },
        listener(callback: (value: T) => void): void {
            _listener = callback;
        }
    };
}

export function stateVariable<T>(stateValue: T, controllerName: string): [T, (value: T) => void] {
    if (!(controllerName in stateVariableList)) {
        stateVariableList[controllerName] = stateValue;
    }

    const setState = (value: T) => {
        stateVariableList[controllerName] = value;

        const executeRenderTemplate = executeRenderTemplateList[controllerName];

        if (executeRenderTemplate) {
            executeRenderTemplate();
        }
    };

    return [stateVariableList[controllerName] as T, setState];
}
