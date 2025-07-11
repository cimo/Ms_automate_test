import { IvirtualNode } from "./JsMvcFwInterface";

export default function createVirtualNodeFromJsx(tag: any, props: any, ...children: any[]): IvirtualNode {
    if (typeof tag === "function") {
        return tag({ ...props, children });
    }

    return {
        type: tag,
        props: props ?? {},
        children: children.flat().map((child) => {
            if (typeof child === "string" || typeof child === "number") {
                return String(child);
            } else {
                return child; // assume child is already a virtual node
            }
        })
    };
}
