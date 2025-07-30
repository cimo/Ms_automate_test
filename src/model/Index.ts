import { IvariableBind } from "../JsMvcFwInterface";

// Source
import * as ModelTester from "../model/Tester";

export interface IvariableList {
    specFileList: IvariableBind<string[]>;
    userList: IvariableBind<string[]>;
    outputList: IvariableBind<ModelTester.IserverDataOutput[]>;
    isLoading: IvariableBind<boolean>;
}

export interface ImethodList {}
