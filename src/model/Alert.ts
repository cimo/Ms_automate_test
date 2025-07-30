import { IvariableBind } from "../JsMvcFwInterface";

export interface IvariableList {
    className: IvariableBind<string>;
    label: IvariableBind<string>;
}

export interface ImethodList {
    onClickClose: () => void;
}
