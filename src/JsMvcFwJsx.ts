import { IvirtualNode, TvirtualNodeChildren } from "./JsMvcFwInterface";

const jsxFactory = (tag: string, property: IvirtualNode["property"] = {}, ...childrenList: TvirtualNodeChildren[]): IvirtualNode => {
    const childrenNormalized: Array<IvirtualNode | string> = [];

    for (const children of childrenList) {
        if (children == null) {
            continue;
        }

        if (typeof children === "number") {
            childrenNormalized.push(String(children));
        } else if (Array.isArray(children)) {
            for (const child of children) {
                if (child == null) {
                    continue;
                }

                childrenNormalized.push(typeof child === "number" ? String(child) : child);
            }
        } else {
            childrenNormalized.push(children);
        }
    }

    return {
        tag,
        property,
        children: childrenNormalized
    };
};

export default jsxFactory;
