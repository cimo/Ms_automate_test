import { IcontrollerOption, IvirtualNode, IvariableBind, IvariableState, Icontroller } from "./JsMvcFwInterface";
import { createVirtualNode, updateVirtualNode } from "./JsMvcFwDom";

let isDebug = false;
let elementRoot: HTMLElement | null = null;
let urlRoot = "";

const virtualNodeObject: Record<string, IvirtualNode> = {};
const renderTriggerObject: Record<string, () => void> = {};
const variableTriggerObject: Record<string, boolean> = {};
const variableStateObject: Record<string, unknown> = {};
const controllerList: IcontrollerOption[] = [];
const proxyCacheWeakMap = new WeakMap<object, unknown>();

const variableLoadedList: string[] = [];
const variableEditedList: string[] = [];

const variableTriggerUpdate = (controllerName: string): void => {
    if (!variableTriggerObject[controllerName]) {
        variableTriggerObject[controllerName] = true;

        Promise.resolve().then(() => {
            const renderTrigger = renderTriggerObject[controllerName];

            if (renderTrigger) {
                renderTrigger();
            }

            variableTriggerObject[controllerName] = false;
        });
    }
};

const variableProxy = <T>(stateValue: T, controllerName: string): T => {
    if (typeof stateValue !== "object" || stateValue === null) {
        return stateValue;
    }

    const proxyCached = proxyCacheWeakMap.get(stateValue as object);

    if (proxyCached) {
        return proxyCached as T;
    }

    const proxy = new Proxy(stateValue as object, {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);

            return typeof result === "object" && result !== null ? variableProxy(result, controllerName) : result;
        },
        set(target, property, newValue, receiver) {
            const success = Reflect.set(target, property, newValue, receiver);

            if (success) {
                variableTriggerUpdate(controllerName);
            }

            return success;
        },
        deleteProperty(target, property) {
            const success = Reflect.deleteProperty(target, property);

            if (success) {
                variableTriggerUpdate(controllerName);
            }

            return success;
        }
    });

    proxyCacheWeakMap.set(stateValue as object, proxy);

    return proxy as T;
};

const variableBindItem = <T>(stateValue: T, controllerName: string, keyName?: string): IvariableBind<T> => {
    let _state = variableProxy(stateValue, controllerName);
    let _listener: ((value: T) => void) | null = null;

    return {
        get state(): T {
            return _state;
        },
        set state(value: T) {
            if (keyName) {
                variableEditedList.push(keyName);
            }

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

    const renderTrigger = () => {
        const virtualNodeNew = controllerValue.view();

        if (!virtualNodeNew || typeof virtualNodeNew !== "object" || !virtualNodeNew.tag) {
            throw new Error(`JsMvcBase.ts => Invalid virtual node returned by controller "${controllerName}"`);
        }

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

    renderTriggerObject[controllerName] = renderTrigger;

    renderTrigger();

    if (controllerValue.subControllerList) {
        for (const subController of controllerValue.subControllerList()) {
            renderTemplate(subController, controllerValue, () => {
                subController.event();
            });
        }
    }
};

export const variableState = <T>(stateValue: T, controllerName: string): IvariableState<T> => {
    if (!(controllerName in variableStateObject)) {
        variableStateObject[controllerName] = variableProxy(stateValue, controllerName);
    }

    return {
        value: variableStateObject[controllerName] as T,
        setValue: (value: T) => {
            variableStateObject[controllerName] = variableProxy(value, controllerName);

            variableTriggerUpdate(controllerName);
        }
    };
};

export const variableBind = <T extends Record<string, unknown>>(
    variableObject: T,
    controllerName: string
): { [A in keyof T]: IvariableBind<T[A]> } => {
    const result = {} as { [A in keyof T]: IvariableBind<T[A]> };

    for (const key in variableObject) {
        if (Object.prototype.hasOwnProperty.call(variableObject, key)) {
            variableLoadedList.push(key);

            result[key] = variableBindItem(variableObject[key] as T[typeof key], controllerName, key);
        }
    }

    return result;
};
