import { IvariableBind } from "../JsMvcFwInterface";

// Source
import * as ModelTester from "../model/Tester";

export interface Ivariable {
    specFileList: IvariableBind<string[]>;
    userList: IvariableBind<string[]>;
    outputList: IvariableBind<ModelTester.IserverDataOutput[]>;
    isLoading: IvariableBind<boolean>;
    listState: IvariableBind<
        {
            id: string;
            label: string;
            value: string;
        }[]
    >;
}

export interface Imethod {}
