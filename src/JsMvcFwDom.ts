import { IvirtualNode } from "./JsMvcFwInterface";

export const createVirtualNode = (virtualNode: IvirtualNode): HTMLElement => {
    const element = document.createElement(virtualNode.type);

    for (const [key, value] of Object.entries(virtualNode.props)) {
        if (key === "style" && typeof value === "object") {
            Object.assign(element.style, value);
        } else if (key.startsWith("on") && typeof value === "function") {
            const eventName = key.slice(2).toLowerCase();

            element.addEventListener(eventName, value);
        } else if (key !== "children" && typeof value !== "function") {
            if (element && element.getAttribute(key) !== String(value)) {
                element.setAttribute(key, String(value));
            }
        }
    }

    for (const children of virtualNode.children) {
        if (typeof children === "string") {
            element.appendChild(document.createTextNode(children));
        } else {
            element.appendChild(createVirtualNode(children));
        }
    }

    return element;
};

export const updateVirtualNode = (element: Element, virtualNode: IvirtualNode, virtualNodeOld: IvirtualNode): void => {
    if (virtualNode.type !== virtualNodeOld.type) {
        const newElement = createVirtualNode(virtualNode);

        element.replaceWith(newElement);

        return;
    }

    for (const [key, value] of Object.entries(virtualNode.props)) {
        if (key === "style" && typeof value === "object") {
            Object.assign((element as HTMLElement).style, value);
        } else if (key.startsWith("on") && typeof value === "function") {
            const eventName = key.slice(2).toLowerCase();

            element.addEventListener(eventName, value);
        } else if (key !== "children" && typeof value !== "function") {
            if (element && element.getAttribute(key) !== String(value)) {
                element.setAttribute(key, String(value));
            }
        }
    }

    for (const key of Object.keys(virtualNodeOld.props)) {
        if (!(key in virtualNode.props) && typeof virtualNodeOld.props[key] !== "function") {
            element.removeAttribute(key);
        }
    }

    const newChildrenList = virtualNode.children;
    const oldChildrenList = virtualNodeOld.children;
    const maxLength = Math.max(newChildrenList.length, oldChildrenList.length);

    for (let i = 0; i < maxLength; i++) {
        const newChild = newChildrenList[i];
        const oldChild = oldChildrenList[i];
        const elementChild = element.childNodes[i];

        if (newChild && !oldChild) {
            element.appendChild(typeof newChild === "string" ? document.createTextNode(newChild) : createVirtualNode(newChild));
        } else if (!newChild && oldChild) {
            element.removeChild(elementChild);
        } else if (typeof newChild === "string" && typeof oldChild === "string") {
            if (elementChild.textContent !== newChild) {
                elementChild.textContent = newChild;
            }
        } else if (typeof newChild === "string" || typeof oldChild === "string") {
            element.replaceChild(typeof newChild === "string" ? document.createTextNode(newChild) : createVirtualNode(newChild), elementChild);
        } else {
            updateVirtualNode(elementChild as Element, newChild as IvirtualNode, oldChild as IvirtualNode);
        }
    }
};
