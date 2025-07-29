import { IbindVariable, IvirtualNode } from "../JsMvcFwInterface";

// Source
import * as ModelTester from "../model/Tester";

export interface IvariableList {
    specFileList: IbindVariable<string[]>;
    userList: IbindVariable<string[]>;
    outputList: IbindVariable<ModelTester.IserverDataOutput[]>;
    isLoading: IbindVariable<boolean>;
    name: IbindVariable<string>;
    count: IbindVariable<number>;
}

export interface ImethodList {
    onInputUpdateName: (value: string) => void;
    onClickCount: () => void;
    onClickOpen: () => void;
}
