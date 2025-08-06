import { IvariableBind } from "../JsMvcFwInterface";

export interface Ivariable {
    className: IvariableBind<string>;
    label: IvariableBind<string>;
}

export interface Imethod {
    onClickClose: () => void;
}
