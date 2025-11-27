import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

export interface Ivariable {
    className: IvariableBind<string>;
    label: IvariableBind<string>;
    isOpen: IvariableBind<boolean>;
}

export interface Imethod {
    onClickClose: () => void;
}

export interface IelementHook extends Record<string, Element | Element[]> {
    clsAlert: Element;
}
