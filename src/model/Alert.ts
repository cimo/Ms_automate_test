import { IbindVariable } from "../JsMvcFwInterface";

export interface IvariableList {
    className: IbindVariable<string>;
    label: IbindVariable<string>;
}

export interface ImethodList {
    onClickClose: () => void;
}
