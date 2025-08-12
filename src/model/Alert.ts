import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

export interface Ivariable {
    className: IvariableBind<string>;
    label: IvariableBind<string>;
}

export interface Imethod {
    onClickClose: () => void;
}
