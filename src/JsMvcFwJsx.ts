import { IvirtualNodeProps, IvirtualNode } from "./JsMvcFwInterface";

type Component = (props: IvirtualNodeProps) => IvirtualNode;
type Child = IvirtualNode | string | number;

const jsxFactory = (tag: string | Component, property: IvirtualNodeProps | null, ...childrenList: Child[]): IvirtualNode => {
    const normalizedChildrenList: Array<IvirtualNode | string> = [];

    for (const child of childrenList.flat()) {
        if (typeof child === "string" || typeof child === "number") {
            normalizedChildrenList.push(String(child));
        } else {
            normalizedChildrenList.push(child);
        }
    }

    if (typeof tag === "function") {
        return tag({ ...(property ?? {}), children: normalizedChildrenList });
    }

    return {
        type: tag,
        props: property ?? {},
        children: normalizedChildrenList
    };
};

export default jsxFactory;
