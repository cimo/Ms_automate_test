import { IvariableState, IvirtualNode } from "../JsMvcFwInterface";

// Source
import * as ModelTester from "../model/Tester";

export interface IvariableList {
    specFileList: IvariableState<string[]>;
    userList: IvariableState<string[]>;
    outputList: IvariableState<ModelTester.IserverDataOutput[]>;
    isLoading: IvariableState<boolean>;
}

export interface ImethodList {
    onClickTest: () => void;
    updateName: (value: string) => void;
}

export interface IsubViewList {
    alert: IvirtualNode;
    dialog: IvirtualNode;
}

export interface Itest {
    name: IvariableState<string>;
}
