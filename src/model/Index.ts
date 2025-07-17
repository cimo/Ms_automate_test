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
    onClickTest: () => void;
    onInputUpdateName: (value: string) => void;
    onClickOpen: () => void;
}

export interface IsubViewList {
    alert: IvirtualNode;
}
