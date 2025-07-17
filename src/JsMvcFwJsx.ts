import { IvirtualNode } from "./JsMvcFwInterface";

type Child = IvirtualNode | string | number;

const jsxFactory = (tag: string, property: IvirtualNode["property"] = {}, ...children: Child[]): IvirtualNode => {
    const normalizedChildren: Array<IvirtualNode | string> = [];

    for (const child of children) {
        if (typeof child === "number") {
            normalizedChildren.push(String(child));
        } else {
            normalizedChildren.push(child);
        }
    }

    return {
        tag,
        property,
        children: normalizedChildren
    };
};

export default jsxFactory;
