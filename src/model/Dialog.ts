import { IbindVariable } from "../JsMvcFwInterface";

export interface IvariableList {
    title: IbindVariable<string>;
    content: IbindVariable<string>;
    isSingleButton: IbindVariable<boolean>;
}

export interface ImethodList {
    onClickAccept: () => void;
    onClickClose: () => void;
}
