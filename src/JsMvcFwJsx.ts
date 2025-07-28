import { IvirtualNode, TvirtualNodeChildren } from "./JsMvcFwInterface";

const jsxFactory = (tag: string, property: IvirtualNode["property"] = {}, ...childrenList: TvirtualNodeChildren[]): IvirtualNode => {
    const childrenNormalized: Array<IvirtualNode | string> = [];

    for (const children of childrenList) {
        if (typeof children === "number") {
            childrenNormalized.push(String(children));
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
