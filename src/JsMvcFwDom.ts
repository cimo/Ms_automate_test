import { IvirtualNode } from "./JsMvcFwInterface";

const applyProperty = (element: Element, key: string, value: any): void => {
    if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (typeof value === "boolean") {
        value ? element.setAttribute(key, "") : element.removeAttribute(key);
    } else if (value !== null && value !== undefined && typeof value !== "object") {
        element.setAttribute(key, value.toString());
    }
};

const updateProperties = (element: Element, oldProps: Record<string, any>, newProps: Record<string, any>): void => {
    for (const key in oldProps) {
        if (!(key in newProps)) {
            if (key.startsWith("on") && typeof oldProps[key] === "function") {
                element.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
            } else {
                element.removeAttribute(key);
            }
        }
    }

    for (const [key, value] of Object.entries(newProps)) {
        const oldValue = oldProps[key];
        if (value !== oldValue) {
            if (key.startsWith("on") && typeof value === "function") {
                if (typeof oldValue === "function") {
                    element.removeEventListener(key.slice(2).toLowerCase(), oldValue);
                }
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else if (typeof value === "boolean") {
                value ? element.setAttribute(key, "") : element.removeAttribute(key);
            } else if (value !== null && value !== undefined && typeof value !== "object") {
                element.setAttribute(key, value.toString());
            }
        }
    }
};

const updateChildren = (element: Element, oldChildren: IvirtualNode["children"], newChildren: IvirtualNode["children"]): void => {
    const domChildren = Array.from(element.childNodes);
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        const domChild = domChildren[i];

        if (!newChild && domChild) {
            element.removeChild(domChild);
        } else if (typeof newChild === "string") {
            if (!domChild) {
                element.appendChild(document.createTextNode(newChild));
            } else if (domChild.nodeType === Node.TEXT_NODE) {
                if (domChild.textContent !== newChild) {
                    domChild.textContent = newChild;
                }
            } else {
                element.replaceChild(document.createTextNode(newChild), domChild);
            }
        } else if (typeof newChild === "object") {
            if (!domChild) {
                element.appendChild(createVirtualNode(newChild));
            } else if (typeof oldChild === "object") {
                updateVirtualNode(domChild as Element, oldChild, newChild);
            } else {
                element.replaceChild(createVirtualNode(newChild), domChild);
            }
        }
    }
};

export const createVirtualNode = (virtualNode: IvirtualNode): HTMLElement => {
    const element = document.createElement(virtualNode.tag);

    for (const [key, value] of Object.entries(virtualNode.property || {})) {
        applyProperty(element, key, value);
    }

    for (const child of virtualNode.children) {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(createVirtualNode(child));
        }
    }

    return element;
};

export const updateVirtualNode = (element: Element, nodeOld: IvirtualNode, nodeNew: IvirtualNode): void => {
    if (nodeOld.tag !== nodeNew.tag) {
        const elementNew = createVirtualNode(nodeNew);
        element.replaceWith(elementNew);
        return;
    }

    updateProperties(element, nodeOld.property || {}, nodeNew.property || {});
    updateChildren(element, nodeOld.children, nodeNew.children);
};
