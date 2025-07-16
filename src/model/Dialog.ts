import { IvariableState } from "../JsMvcFwInterface";

export interface IvariableList {
    title: IvariableState<string>;
    content: IvariableState<string>;
}

export interface ImethodList {
    onClickAccept: () => void;
    onClickClose: () => void;
}
