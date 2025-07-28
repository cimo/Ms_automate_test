import { TvirtualNodeProperty, IvirtualNode } from "./JsMvcFwInterface";

const applyProperty = (element: Element, key: string, valueNew: TvirtualNodeProperty, valueOld?: TvirtualNodeProperty): void => {
    if (key.startsWith("on") && typeof valueNew === "function") {
        if (typeof valueOld === "function") {
            element.removeEventListener(key.slice(2).toLowerCase(), valueOld);
        }

        element.addEventListener(key.slice(2).toLowerCase(), valueNew);
    } else if (typeof valueNew === "boolean") {
        valueNew ? element.setAttribute(key, "") : element.removeAttribute(key);
    } else if (typeof valueNew === "string" || typeof valueNew === "number") {
        element.setAttribute(key, valueNew.toString());
    }
};

const updateProperty = (element: Element, oldList: Record<string, TvirtualNodeProperty>, newList: Record<string, TvirtualNodeProperty>): void => {
    for (const key in oldList) {
        if (!(key in newList)) {
            if (key.startsWith("on") && typeof oldList[key] === "function") {
                element.removeEventListener(key.slice(2).toLowerCase(), oldList[key]);
            } else {
                element.removeAttribute(key);
            }
        }
    }

    for (const [key, value] of Object.entries(newList)) {
        const valueOld = oldList[key];

        if (value !== valueOld) {
            applyProperty(element, key, value, valueOld);
        }
    }
};

const updateChildren = (element: Element, nodeOldList: IvirtualNode["children"], nodeNewList: IvirtualNode["children"]): void => {
    const nodeList = Array.from(element.childNodes);
    const nodeMaxLength = Math.max(nodeOldList.length, nodeNewList.length);

    for (let a = 0; a < nodeMaxLength; a++) {
        const nodeOld = nodeOldList[a];
        const nodeNew = nodeNewList[a];
        const nodeDom = nodeList[a];

        if (!nodeNew && nodeDom) {
            element.removeChild(nodeDom);
        } else if (typeof nodeNew === "string") {
            if (!nodeDom) {
                element.appendChild(document.createTextNode(nodeNew));
            } else if (nodeDom.nodeType === Node.TEXT_NODE) {
                if (nodeDom.textContent !== nodeNew) {
                    nodeDom.textContent = nodeNew;
                }
            } else {
                element.replaceChild(document.createTextNode(nodeNew), nodeDom);
            }
        } else if (typeof nodeNew === "object") {
            if (!nodeDom) {
                element.appendChild(createVirtualNode(nodeNew));
            } else if (typeof nodeOld === "object") {
                updateVirtualNode(nodeDom as Element, nodeOld, nodeNew);
            } else {
                element.replaceChild(createVirtualNode(nodeNew), nodeDom);
            }
        }
    }
};

export const createVirtualNode = (node: IvirtualNode): HTMLElement => {
    const element = document.createElement(node.tag);

    for (const [key, value] of Object.entries(node.property || {})) {
        applyProperty(element, key, value);
    }

    for (const child of node.children) {
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

    updateProperty(element, nodeOld.property || {}, nodeNew.property || {});

    updateChildren(element, nodeOld.children, nodeNew.children);
};
