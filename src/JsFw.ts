// framework.ts

type VNode = {
    type: string;
    props: Record<string, any>;
    children: Array<VNode | string>;
};

function createVNodeFromElement(el: Element): VNode {
    const children: Array<VNode | string> = [];
    el.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.textContent || "");
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            children.push(createVNodeFromElement(child as Element));
        }
    });

    const props: Record<string, any> = {};
    for (const attr of el.attributes) {
        props[attr.name] = attr.value;
    }

    return {
        type: el.tagName.toLowerCase(),
        props,
        children
    };
}

function createVNodeFromHTML(html: string): VNode {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return createVNodeFromElement(template.content.firstElementChild!);
}

function updateDOM(el: Element, newVNode: VNode, oldVNode: VNode) {
    if (newVNode.type !== oldVNode.type) {
        const newEl = createElement(newVNode);
        el.replaceWith(newEl);
        return;
    }

    // Update attributes
    for (const [key, value] of Object.entries(newVNode.props)) {
        if (el.getAttribute(key) !== value) {
            el.setAttribute(key, value);
        }
    }

    for (const key of Object.keys(oldVNode.props)) {
        if (!(key in newVNode.props)) {
            el.removeAttribute(key);
        }
    }

    // Update children
    const newChildren = newVNode.children;
    const oldChildren = oldVNode.children;
    const maxLen = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLen; i++) {
        const newChild = newChildren[i];
        const oldChild = oldChildren[i];
        const domChild = el.childNodes[i];

        if (!oldChild && newChild) {
            el.appendChild(typeof newChild === "string" ? document.createTextNode(newChild) : createElement(newChild));
        } else if (oldChild && !newChild) {
            el.removeChild(domChild);
        } else if (typeof newChild === "string" && typeof oldChild === "string") {
            if (newChild !== oldChild) {
                domChild.textContent = newChild;
            }
        } else if (typeof newChild === "string" || typeof oldChild === "string") {
            el.replaceChild(typeof newChild === "string" ? document.createTextNode(newChild) : createElement(newChild as VNode), domChild);
        } else {
            updateDOM(domChild as Element, newChild as VNode, oldChild as VNode);
        }
    }
}

function createElement(vnode: VNode): Element {
    const el = document.createElement(vnode.type);
    for (const [key, value] of Object.entries(vnode.props)) {
        el.setAttribute(key, value);
    }

    vnode.children.forEach((child) => {
        if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
        } else {
            el.appendChild(createElement(child));
        }
    });

    return el;
}

let oldVNode: VNode | null = null;
let root: HTMLElement;

export function initFramework(rootElement: HTMLElement) {
    root = rootElement;
}

export function renderTemplate(template: string) {
    const newVNode = createVNodeFromHTML(template);
    if (!oldVNode) {
        const dom = createElement(newVNode);
        root.appendChild(dom);
    } else {
        updateDOM(root.firstElementChild!, newVNode, oldVNode);
    }
    oldVNode = newVNode;
}
