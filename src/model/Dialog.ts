import { IvariableBind } from "../JsMvcFwInterface";

export interface IvariableList {
    title: IvariableBind<string>;
    content: IvariableBind<string>;
    isSingleButton: IvariableBind<boolean>;
}

export interface ImethodList {
    onClickAccept: () => void;
    onClickClose: () => void;
}
