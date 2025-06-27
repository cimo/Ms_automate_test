import { IvNodeProps, IvNode, IvariableStateA } from "./JsFwInterface";

function createVNodeFromElement(el: Element): IvNode {
    const children: Array<IvNode | string> = [];
    el.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.textContent || "");
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            children.push(createVNodeFromElement(child as Element));
        }
    });

    const props: IvNodeProps = {};
    for (const attr of el.attributes) {
        props[attr.name] = attr.value;
    }

    return {
        type: el.tagName.toLowerCase(),
        props,
        children
    };
}

function createVNodeFromHTML(html: string): IvNode {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return createVNodeFromElement(template.content.firstElementChild!);
}

function updateDOM(el: Element, newVNode: IvNode, oldVNode: IvNode) {
    if (newVNode.type !== oldVNode.type) {
        const newEl = createElement(newVNode);
        el.replaceWith(newEl);
        return;
    }

    // Update attributes
    for (const [key, value] of Object.entries(newVNode.props)) {
        if (el.getAttribute(key) !== value) {
            el.setAttribute(key, String(value));
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
            el.replaceChild(typeof newChild === "string" ? document.createTextNode(newChild) : createElement(newChild as IvNode), domChild);
        } else {
            updateDOM(domChild as Element, newChild as IvNode, oldChild as IvNode);
        }
    }
}

function createElement(vnode: IvNode): Element {
    const el = document.createElement(vnode.type);
    for (const [key, value] of Object.entries(vnode.props)) {
        el.setAttribute(key, String(value));
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

let isDebug: boolean = false;
let urlRoot: string = "";
let elementRoot: HTMLElement | null = null;
let oldVNode: IvNode | null = null;

export const getIsDebug = () => {
    return isDebug;
};

export const getUrlRoot = () => {
    return urlRoot;
};

export const getElementRoot = () => {
    return elementRoot;
};

export const writeLog = (tag: string, value: string | string[] | Record<string, unknown> | Error): void => {
    if (isDebug) {
        // eslint-disable-next-line no-console
        console.log(`${tag} `, value);
    }
};

export function frameworkInit(isDebugValue: boolean, urlRootValue: string, elementRootValue: string) {
    isDebug = isDebugValue;
    urlRoot = urlRootValue;
    elementRoot = document.getElementById(elementRootValue);
}

export function renderTemplate(template: string) {
    const newVNode = createVNodeFromHTML(template);

    if (elementRoot) {
        if (!oldVNode) {
            const dom = createElement(newVNode);

            elementRoot.appendChild(dom);
        } else {
            updateDOM(elementRoot.firstElementChild!, newVNode, oldVNode);
        }
    }

    oldVNode = newVNode;
}

export function bindState<T>(initial: { state: T }, template: () => string): IvariableStateA<T> {
    let listeners: Array<(value: T) => void> = [];

    const proxy = new Proxy(initial, {
        set(target, prop, value) {
            if (prop === "state") {
                target[prop] = value;

                renderTemplate(template());

                listeners.forEach((fn) => fn(value));

                return true;
            }

            return false;
        }
    });

    return {
        get state() {
            return proxy.state;
        },
        set state(value: T) {
            proxy.state = value;
        },
        listener(callback: (value: T) => void) {
            listeners.push(callback);
        }
    };
}
