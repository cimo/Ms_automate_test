import {
    IvirtualNodeObject,
    ItriggerRenderObject,
    IvariableStateObject,
    IcontrollerOption,
    IvariableBind,
    IvariableState,
    Icontroller
} from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let elementRoot: HTMLElement | null = null;
let urlRoot = "";

const virtualNodeObject: IvirtualNodeObject = {};
const triggerRenderObject: ItriggerRenderObject = {};
const variableStateObject: IvariableStateObject = {};
const controllerList: IcontrollerOption[] = [];

const variableTriggerUpdate = (controllerName: string): void => {
    const triggerRender = triggerRenderObject[controllerName];

    if (triggerRender) {
        triggerRender();
    }
};

const variableProxy = <T>(stateValue: T, controllerName: string): T => {
    if (typeof stateValue !== "object" || stateValue === null) {
        return stateValue;
    }

    return new Proxy(stateValue as object, {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);

            return typeof result === "object" && result !== null ? variableProxy(result, controllerName) : result;
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
export const getControllerList = () => controllerList;

export const frameworkInit = (isDebugValue: boolean, elementRootId: string, urlRootValue: string): void => {
    isDebug = isDebugValue;
    elementRoot = document.getElementById(elementRootId);
    urlRoot = urlRootValue;
};

export const renderTemplate = (controllerValue: Icontroller, controllerParent?: Icontroller, callback?: () => void): void => {
    const controllerName = controllerValue.getName();

    if (!controllerParent) {
        controllerList.push({ parent: controllerValue, childrenList: [] });
    } else {
        for (const controller of controllerList) {
            if (controllerParent.getName() === controller.parent.getName()) {
                controller.childrenList.push(controllerValue);

                break;
            }
        }
    }

    controllerValue.variable();

    const triggerRender = () => {
        const virtualNodeNew = controllerValue.view();

        let elementContainer: Element | null = null;

        if (!controllerParent) {
            if (!elementRoot) {
                throw new Error("JsMvcBase.ts => Root element #jsmvcfw_app not found!");
            }

            elementContainer = elementRoot;
        } else {
            const parentContainer = document.querySelector(`[data-jsmvcfw-controllerName="${controllerParent.getName()}"]`);

            if (!parentContainer) {
                throw new Error(`JsMvcBase.ts => Tag data-jsmvcfw-controllerName="${controllerParent.getName()}" not found!`);
            }

            elementContainer = parentContainer.querySelector(`[data-jsmvcfw-controllerName="${controllerName}"]`);

            if (!elementContainer) {
                throw new Error(
                    `JsMvcBase.ts => Tag data-jsmvcfw-controllerName="${controllerName}" not found inside data-jsmvcfw-controllerName="${controllerParent.getName()}"!`
                );
            }
        }

        const virtualNodeOld = virtualNodeObject[controllerName];

        if (!virtualNodeOld) {
            if (elementContainer) {
                const elementVirtualNode = createVirtualNode(virtualNodeNew);

                elementContainer.innerHTML = "";
                elementContainer.appendChild(elementVirtualNode);

                if (callback) {
                    callback();
                }
            }
        } else {
            if (elementContainer) {
                const elementFirstChild = elementContainer.firstElementChild;

                if (elementFirstChild) {
                    updateVirtualNode(elementFirstChild, virtualNodeOld, virtualNodeNew);
                }
            }
        }

        virtualNodeObject[controllerName] = virtualNodeNew;
    };

    triggerRenderObject[controllerName] = triggerRender;

    triggerRender();

    if (controllerValue.subControllerList) {
        for (const subController of controllerValue.subControllerList()) {
            renderTemplate(subController, controllerValue, () => {
                subController.event();
            });
        }
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const variableBind = <T>(stateValue: T, controllerName: string, stateName?: string): IvariableBind<T> => {
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

export const variableState = <T>(stateValue: T, controllerName: string): IvariableState<T> => {
    if (!(controllerName in variableStateObject)) {
        variableStateObject[controllerName] = variableProxy(stateValue, controllerName);
    }

    const setValue = (value: T) => {
        variableStateObject[controllerName] = variableProxy(value, controllerName);

        variableTriggerUpdate(controllerName);
    };

    return {
        value: variableStateObject[controllerName] as T,
        setValue
    };
};

export const bindAll = <T extends Record<string, unknown>>(initialValues: T, controllerName: string): { [K in keyof T]: IvariableBind<T[K]> } => {
    const result = {} as { [K in keyof T]: IvariableBind<T[K]> };

    for (const key in initialValues) {
        if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
            result[key] = variableBind(initialValues[key] as T[typeof key], controllerName, key);
        }
    }

    return result;
};
