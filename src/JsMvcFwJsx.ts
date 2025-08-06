import { IvirtualNode, TvirtualNodeChildren } from "./JsMvcFwInterface";

const jsxFactory = (
    tag: string,
    propertyObjectValue: IvirtualNode["propertyObject"] = {},
    ...childrenListValue: TvirtualNodeChildren[]
): IvirtualNode => {
    const childrenList: Array<IvirtualNode | string> = [];

    for (let a = 0; a < childrenListValue.length; a++) {
        const child = childrenListValue[a];

        if (child == null) {
            continue;
        }

        if (Array.isArray(child)) {
            for (let b = 0; b < child.length; b++) {
                const childNested = child[b];

                if (childNested == null) {
                    continue;
                }

                childrenList.push(typeof childNested === "number" ? String(childNested) : childNested);
            }
        } else {
            childrenList.push(typeof child === "number" ? String(child) : child);
        }
    }

    const { key, ...propertyObject } = propertyObjectValue ?? {};

    return {
        tag,
        propertyObject,
        childrenList,
        key: key !== undefined ? String(key) : undefined
    };
};

export default jsxFactory;
