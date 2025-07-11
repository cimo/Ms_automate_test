import { IvariableState } from "../JsMvcFwInterface";

// Source
import * as ModelTester from "../model/Tester";

export interface IvariableList {
    specFileList: IvariableState<string[]>;
    clientList: IvariableState<string[]>;
    serverDataOutputList: IvariableState<ModelTester.IserverDataOutput[]>;
    isLoading: IvariableState<boolean>;
}

export interface ImethodList {
    onClickTest: () => void;
}
