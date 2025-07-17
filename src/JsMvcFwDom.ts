import { IvirtualNode } from "./JsMvcFwInterface";

export const createVirtualNode = (virtualNode: IvirtualNode): HTMLElement => {
    const element = document.createElement(virtualNode.tag);

    for (const [key, value] of Object.entries(virtualNode.property || {})) {
        if (key.startsWith("on") && typeof value === "function") {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (typeof value === "boolean") {
            if (value) {
                element.setAttribute(key, "");
            } else {
                element.removeAttribute(key);
            }
        } else if (value !== null && value !== undefined && typeof value !== "object") {
            element.setAttribute(key, value.toString());
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

export const updateVirtualNode = (element: Element, nodeOld: IvirtualNode, nodeNew: IvirtualNode): void => {
    if (nodeOld.tag !== nodeNew.tag) {
        const elementNew = createVirtualNode(nodeNew);

        element.replaceWith(elementNew);

        return;
    }

    const nodeOldPropertyList = nodeOld.property || {};
    const nodeNewPropertyList = nodeNew.property || {};

    for (const key in nodeOldPropertyList) {
        if (!(key in nodeNewPropertyList)) {
            if (key.startsWith("on") && typeof nodeOldPropertyList[key] === "function") {
                element.removeEventListener(key.slice(2).toLowerCase(), nodeOldPropertyList[key] as EventListener);
            } else {
                element.removeAttribute(key);
            }
        }
    }

    for (const [key, value] of Object.entries(nodeNewPropertyList)) {
        const nodeOldProperty = nodeOldPropertyList[key];

        if (value !== nodeOldProperty) {
            if (key.startsWith("on") && typeof value === "function") {
                if (typeof nodeOldProperty === "function") {
                    element.removeEventListener(key.slice(2).toLowerCase(), nodeOldProperty);
                }

                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else if (typeof value === "boolean") {
                if (value) {
                    element.setAttribute(key, "");
                } else {
                    element.removeAttribute(key);
                }
            } else if (value !== null && value !== undefined && typeof value !== "object") {
                element.setAttribute(key, value.toString());
            }
        }
    }

    const nodeNewChildrenList = nodeNew.children;
    const nodeOldChildrenList = nodeOld.children;
    const nodeDomChildrenList = Array.from(element.childNodes);

    const nodeChildrenLimit = Math.max(nodeNewChildrenList.length, nodeOldChildrenList.length);

    for (let i = 0; i < nodeChildrenLimit; i++) {
        const nodeNewChildren = nodeNewChildrenList[i];
        const nodeOldChildren = nodeOldChildrenList[i];
        const nodeDomChildren = nodeDomChildrenList[i];

        if (!nodeNewChildren && nodeDomChildren) {
            element.removeChild(nodeDomChildren);
        } else if (typeof nodeNewChildren === "string") {
            if (!nodeDomChildren) {
                element.appendChild(document.createTextNode(nodeNewChildren));
            } else if (nodeDomChildren.nodeType === Node.TEXT_NODE) {
                if (nodeDomChildren.textContent !== nodeNewChildren) {
                    nodeDomChildren.textContent = nodeNewChildren;
                }
            } else {
                const textNode = document.createTextNode(nodeNewChildren);

                element.replaceChild(textNode, nodeDomChildren);
            }
        } else if (typeof nodeNewChildren === "object") {
            if (!nodeDomChildren) {
                element.appendChild(createVirtualNode(nodeNewChildren));
            } else if (typeof nodeOldChildren === "object") {
                updateVirtualNode(nodeDomChildren as Element, nodeOldChildren, nodeNewChildren);
            } else {
                const elementNew = createVirtualNode(nodeNewChildren);

                element.replaceChild(elementNew, nodeDomChildren);
            }
        }
    }
};
