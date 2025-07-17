import { IvirtualNode } from "./JsMvcFwInterface";

const jsxFactory = (tag: string, property: IvirtualNode["property"], ...children: IvirtualNode["children"]): IvirtualNode => {
    return {
        tag,
        property,
        children
    };
};

export default jsxFactory;
