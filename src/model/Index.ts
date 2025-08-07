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
    name: IvariableBind<string>;
    count: IvariableBind<number>;
}

export interface Imethod {
    onClickCount: () => void;
    onInputUpdateName: (event: Event) => void;
    onClickOpen: () => void;
}
