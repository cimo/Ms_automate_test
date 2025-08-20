import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

export interface Ivariable {
    title: IvariableBind<string>;
    content: IvariableBind<string>;
    isSingleButton: IvariableBind<boolean>;
}

export interface Imethod {
    onClickAccept: () => void;
    onClickClose: () => void;
}

export interface IelementHook extends Record<string, Element> {
    mdcDialog: HTMLElement;
}
