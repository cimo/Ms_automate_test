import { TvirtualNodeProperty, IvirtualNode } from "./JsMvcFwInterface";

const applyProperty = (element: Element, key: string, valueNew: TvirtualNodeProperty, valueOld?: TvirtualNodeProperty): void => {
    if (key.startsWith("on") && typeof valueNew === "function") {
        const eventName = key.slice(2).toLowerCase();

        if (typeof valueOld === "function") {
            element.removeEventListener(eventName, valueOld);
        }

        element.addEventListener(eventName, valueNew);
    } else if (typeof valueNew === "boolean") {
        valueNew ? element.setAttribute(key, "") : element.removeAttribute(key);
    } else if (typeof valueNew === "string" || typeof valueNew === "number") {
        element.setAttribute(key, valueNew.toString());
    }
};

const updateProperty = (element: Element, oldObject: Record<string, TvirtualNodeProperty>, newObject: Record<string, TvirtualNodeProperty>): void => {
    for (const key in oldObject) {
        if (!(key in newObject)) {
            if (key.startsWith("on") && typeof oldObject[key] === "function") {
                element.removeEventListener(key.slice(2).toLowerCase(), oldObject[key]);
            } else {
                element.removeAttribute(key);
            }
        }
    }

    for (const [key, value] of Object.entries(newObject)) {
        const valueOld = oldObject[key];

        if (value !== valueOld) {
            applyProperty(element, key, value, valueOld);
        }
    }
};

const patchNode = (element: Element, nodeNew: IvirtualNode | string, nodeOld: IvirtualNode | string, nodeDom: ChildNode | undefined) => {
    if (typeof nodeNew === "string") {
        if (!nodeDom || nodeDom.nodeType !== Node.TEXT_NODE) {
            const nodeText = document.createTextNode(nodeNew);

            if (nodeDom) {
                element.replaceChild(nodeText, nodeDom);
            } else {
                element.appendChild(nodeText);
            }

            return nodeText;
        } else {
            if (nodeDom.textContent !== nodeNew) {
                nodeDom.textContent = nodeNew;
            }

            return nodeDom;
        }
    } else {
        if (!nodeDom || nodeDom.nodeType === Node.TEXT_NODE) {
            const node = createVirtualNode(nodeNew);

            if (nodeDom) {
                element.replaceChild(node, nodeDom);
            } else {
                element.appendChild(node);
            }

            return node;
        } else {
            updateVirtualNode(nodeDom as Element, nodeOld as IvirtualNode, nodeNew);

            return nodeDom;
        }
    }
};

const updateChildren = (element: Element, nodeOldListValue: IvirtualNode["childrenList"], nodeNewListValue: IvirtualNode["childrenList"]): void => {
    const nodeOldList = Array.isArray(nodeOldListValue) ? nodeOldListValue : [];
    const nodeNewList = Array.isArray(nodeNewListValue) ? nodeNewListValue : [];

    const oldKeyObject: Record<string, { node: IvirtualNode | string; nodeDom: ChildNode }> = {};

    for (let a = 0; a < nodeOldList.length; a++) {
        const node = nodeOldList[a];

        if (typeof node === "object" && node.key !== undefined) {
            oldKeyObject[node.key] = { node, nodeDom: element.childNodes[a] };
        }
    }

    let nodeChild: ChildNode | null = null;

    for (let a = 0; a < nodeNewList.length; a++) {
        const nodeNew = nodeNewList[a];
        const key = typeof nodeNew === "object" && nodeNew.key !== undefined ? nodeNew.key : undefined;

        if (key !== undefined && oldKeyObject[key]) {
            const { node, nodeDom } = oldKeyObject[key];

            const nodeItem = patchNode(element, nodeNew, node, nodeDom);

            if (nodeChild == null) {
                if (element.firstChild !== nodeItem) {
                    element.insertBefore(nodeItem, element.firstChild);
                }
            } else if (nodeChild.nextSibling !== nodeItem) {
                element.insertBefore(nodeItem, nodeChild.nextSibling);
            }

            nodeChild = nodeItem;

            delete oldKeyObject[key];
        } else {
            const nodeDom = element.childNodes[a];

            const nodeItem = patchNode(element, nodeNew, nodeOldList[a], nodeDom);

            nodeChild = nodeItem;
        }
    }

    for (const key in oldKeyObject) {
        if (Object.prototype.hasOwnProperty.call(oldKeyObject, key)) {
            element.removeChild(oldKeyObject[key].nodeDom);
        }
    }

    while (element.childNodes.length > nodeNewList.length) {
        element.removeChild(element.lastChild!);
    }
};

export const createVirtualNode = (node: IvirtualNode): HTMLElement => {
    const element = document.createElement(node.tag);

    for (const [key, value] of Object.entries(node.propertyObject ?? {})) {
        applyProperty(element, key, value);
    }

    if (Array.isArray(node.childrenList)) {
        for (const child of node.childrenList) {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(createVirtualNode(child));
            }
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

    updateProperty(element, nodeOld.propertyObject ?? {}, nodeNew.propertyObject ?? {});

    updateChildren(element, nodeOld.childrenList, nodeNew.childrenList);
};
