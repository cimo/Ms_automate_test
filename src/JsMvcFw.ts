import { IvirtualNode, IvariableBind, Icontroller, TvariableState } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let elementRoot: HTMLElement | null = null;
let urlRoot = "";
let subControllerList: Icontroller[] = [];

const virtualNodeList: Record<string, IvirtualNode | null> = {};
const triggerRenderList: Record<string, () => void> = {};
const variableStateList: Record<string, unknown> = {};

const variableTriggerUpdate = <T>(controllerName: string): void => {
    const triggerRender = triggerRenderList[controllerName];

    if (triggerRender) {
        triggerRender();
    }
};

const variableProxy = <T>(targetValue: T, controllerName: string): T => {
    if (typeof targetValue !== 'object' || targetValue === null) {
        return targetValue;
    }

    return new Proxy(targetValue as object, {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);

            return typeof result === 'object' && result !== null ? variableProxy(result, controllerName) : result;
        },
        set(target, property, newValue, receiver) {
            const result = Reflect.set(target, property, newValue, receiver);

            variableTriggerUpdate(controllerName);

            return result;
        },
        deleteProperty(target, property) {
            const result = Reflect.deleteProperty(target, property);

            variableTriggerUpdate(controllerName);

            return result;
        }
    }) as T;
};

export const getIsDebug = () => isDebug;
export const getElementRoot = () => elementRoot;
export const getUrlRoot = () => urlRoot;
export const getSubControllerList = () => subControllerList;

export const frameworkInit = (isDebugValue: boolean, elementRootId: string, urlRootValue: string): void => {
    isDebug = isDebugValue;
    elementRoot = document.getElementById(elementRootId);
    urlRoot = urlRootValue;
};

export const renderTemplate = (controller: Icontroller, controllerParent?: Icontroller, callback?: () => void): void => {
    const controllerName = controller.name();

    controller.variable();

    const triggerRender = () => {
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

            if (callback) {
                callback();
            }
        } else {
            const elementFirstChild = elementContainer.firstElementChild;

            if (elementFirstChild) {
                updateVirtualNode(elementFirstChild, virtualNodeOld, virtualNodeNew);
            }
        }

        virtualNodeList[controllerName] = virtualNodeNew;
    };

    triggerRenderList[controllerName] = triggerRender;

    triggerRender();

    if (controller.subControllerList) {
        subControllerList = controller.subControllerList();

        for (const subController of subControllerList) {
            renderTemplate(subController, controller, () => {
                subController.event();
            });
        }
    }
};

export const variableBind = <T>(stateValue: T, controllerName: string): IvariableBind<T> => {
    let _state = variableProxy(stateValue, controllerName);
    let _listener: ((value: T) => void) | null = null;

    return {
        get state(): T {
            return _state;
        },
        set state(value: T) {
            _state = variableProxy(value, controllerName);

            if (_listener) {
                _listener(_state);
            }

            variableTriggerUpdate(controllerName);
        },
        listener(callback: (value: T) => void): void {
            _listener = callback;
        }
    };
};

export const variableState = <T>(stateValue: T, controllerName: string): TvariableState<T> => {
    if (!(controllerName in variableStateList)) {
        variableStateList[controllerName] = variableProxy(stateValue, controllerName);
    }

    const setState = (value: T) => {
        variableStateList[controllerName] = variableProxy(value, controllerName);

        variableTriggerUpdate(controllerName);
    };

    return [variableStateList[controllerName] as T, setState];
};
