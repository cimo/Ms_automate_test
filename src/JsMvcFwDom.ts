import { IvirtualNode } from "./JsMvcFwInterface";

export const createVirtualNode = (virtualNode: IvirtualNode): HTMLElement => {
    const el = document.createElement(virtualNode.tag);

    for (const [key, value] of Object.entries(virtualNode.property || {})) {
        if (typeof value === "function" && key.startsWith("on")) {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (typeof value === "boolean") {
            if (value) el.setAttribute(key, "");
            else el.removeAttribute(key);
        } else if (value !== null && value !== undefined && typeof value !== "object") {
            el.setAttribute(key, value.toString());
        }
    }

    for (const child of virtualNode.children) {
        if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
        } else {
            el.appendChild(createVirtualNode(child));
        }
    }

    return el;
};

export const updateVirtualNode = (element: Element, newVNode: IvirtualNode, oldVNode: IvirtualNode): void => {
    if (newVNode.tag !== oldVNode.tag) {
        const newEl = createVirtualNode(newVNode);
        element.replaceWith(newEl);
        return;
    }

    const newProps = newVNode.property || {};
    const oldProps = oldVNode.property || {};

    for (const key in oldProps) {
        if (!(key in newProps)) {
            if (key.startsWith("on") && typeof oldProps[key] === "function") {
                element.removeEventListener(key.slice(2).toLowerCase(), oldProps[key] as EventListener);
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
                if (value) element.setAttribute(key, "");
                else element.removeAttribute(key);
            } else if (value !== null && value !== undefined && typeof value !== "object") {
                element.setAttribute(key, value.toString());
            }
        }
    }

    const newChildren = newVNode.children;
    const oldChildren = oldVNode.children;
    const domChildren = Array.from(element.childNodes);

    const max = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < max; i++) {
        const newChild = newChildren[i];
        const oldChild = oldChildren[i];
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
                const textNode = document.createTextNode(newChild);
                element.replaceChild(textNode, domChild);
            }
        } else if (typeof newChild === "object") {
            if (!domChild) {
                element.appendChild(createVirtualNode(newChild));
            } else if (typeof oldChild === "object") {
                updateVirtualNode(domChild as Element, newChild, oldChild);
            } else {
                const newEl = createVirtualNode(newChild);
                element.replaceChild(newEl, domChild);
            }
        }
    }
};
