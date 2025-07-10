import { IvirtualNodeProps, IvirtualNode } from "./JsMvcFwInterface";

const createVirtualNodeFromElement = (element: Element): IvirtualNode => {
    const childrenList: Array<IvirtualNode | string> = [];

    for (const elementChildNode of element.childNodes) {
        if (elementChildNode.nodeType === Node.TEXT_NODE) {
            childrenList.push(elementChildNode.textContent || "");
        } else if (elementChildNode.nodeType === Node.ELEMENT_NODE) {
            const virtualNode = createVirtualNodeFromElement(elementChildNode as Element);

            childrenList.push(virtualNode);
        }
    }

    const props: IvirtualNodeProps = {};

    for (const elementAttribute of element.attributes) {
        props[elementAttribute.name] = elementAttribute.value;
    }

    return {
        type: element.tagName.toLowerCase(),
        props,
        children: childrenList
    };
};

export const createVirtualNodeFromHTML = (templateOld: string): IvirtualNode => {
    const template = document.createElement("template");
    template.innerHTML = templateOld.trim();

    const fragment = document.createElement("div");
    fragment.setAttribute("data-fragment", "true");

    for (const childNode of template.content.childNodes) {
        fragment.appendChild(childNode);
    }

    return createVirtualNodeFromElement(fragment);
};

export const createElement = (virtualNode: IvirtualNode): Element => {
    const element = document.createElement(virtualNode.type);

    for (const [key, value] of Object.entries(virtualNode.props)) {
        element.setAttribute(key, String(value));
    }

    for (const virtualNodeChildren of virtualNode.children) {
        if (typeof virtualNodeChildren === "string") {
            const elementTextNode = document.createTextNode(virtualNodeChildren);

            element.appendChild(elementTextNode);
        } else {
            const elementNew = createElement(virtualNodeChildren);

            element.appendChild(elementNew);
        }
    }

    return element;
};

export const updateDOM = (element: Element, virtualNode: IvirtualNode, virtualNodeOld: IvirtualNode): void => {
    if (virtualNode.type !== virtualNodeOld.type) {
        const elementNew = createElement(virtualNode);
        element.replaceWith(elementNew);

        return;
    }

    for (const [key, value] of Object.entries(virtualNode.props)) {
        if (element.getAttribute(key) !== value) {
            element.setAttribute(key, String(value));
        }
    }

    for (const key of Object.keys(virtualNodeOld.props)) {
        if (!(key in virtualNode.props)) {
            element.removeAttribute(key);
        }
    }

    const virtualNodeChildrenList = virtualNode.children;
    const virtualNodeChildrenOldList = virtualNodeOld.children;
    const virtualNodeMaxLength = Math.max(virtualNodeChildrenList.length, virtualNodeChildrenOldList.length);

    for (let i = 0; i < virtualNodeMaxLength; i++) {
        const virtualNodeChildren = virtualNodeChildrenList[i];
        const virtualNodeChildrenOld = virtualNodeChildrenOldList[i];
        const elementChildren = element.childNodes[i];

        if (virtualNodeChildren && !virtualNodeChildrenOld) {
            element.appendChild(
                typeof virtualNodeChildren === "string" ? document.createTextNode(virtualNodeChildren) : createElement(virtualNodeChildren)
            );
        } else if (!virtualNodeChildren && virtualNodeChildrenOld) {
            element.removeChild(elementChildren);
        } else if (typeof virtualNodeChildren === "string" && typeof virtualNodeChildrenOld === "string") {
            if (virtualNodeChildren !== virtualNodeChildrenOld) {
                elementChildren.textContent = virtualNodeChildren;
            }
        } else if (typeof virtualNodeChildren === "string" || typeof virtualNodeChildrenOld === "string") {
            element.replaceChild(
                typeof virtualNodeChildren === "string"
                    ? document.createTextNode(virtualNodeChildren)
                    : createElement(virtualNodeChildren as IvirtualNode),
                elementChildren
            );
        } else {
            updateDOM(elementChildren as Element, virtualNodeChildren as IvirtualNode, virtualNodeChildrenOld as IvirtualNode);
        }
    }
};
