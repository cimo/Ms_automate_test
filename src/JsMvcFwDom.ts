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
            element.setAttribute(key, String(value));
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
        if (typeof value === "function") continue;

        if (element.getAttribute(key) !== String(value)) {
            element.setAttribute(key, String(value));
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
        const newChildren = newChildrenList[i];
        const oldChildren = oldChildrenList[i];
        const elementChildren = element.childNodes[i];

        if (newChildren && !oldChildren) {
            element.appendChild(typeof newChildren === "string" ? document.createTextNode(newChildren) : createVirtualNode(newChildren));
        } else if (!newChildren && oldChildren) {
            element.removeChild(elementChildren);
        } else if (typeof newChildren === "string" && typeof oldChildren === "string") {
            if (newChildren !== oldChildren) {
                elementChildren.textContent = newChildren;
            }
        } else if (typeof newChildren === "string" || typeof oldChildren === "string") {
            element.replaceChild(
                typeof newChildren === "string" ? document.createTextNode(newChildren) : createVirtualNode(newChildren),
                elementChildren
            );
        } else {
            updateVirtualNode(elementChildren as Element, newChildren as IvirtualNode, oldChildren as IvirtualNode);
        }
    }
};
