import { IvariableBind } from "../JsMvcFwInterface";

export interface Ivariable {
    title: IvariableBind<string>;
    content: IvariableBind<string>;
    isSingleButton: IvariableBind<boolean>;
}

export interface Imethod {
    onClickAccept: () => void;
    onClickClose: () => void;
}
