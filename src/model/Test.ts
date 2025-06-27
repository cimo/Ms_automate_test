import { IvariableStateA } from "../JsFwInterface";

// Source

export type IvariableListA = {
    count: IvariableStateA<number>;
    list: IvariableStateA<string[]>;
    className: IvariableStateA<string>;
};
