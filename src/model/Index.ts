import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelTester from "../model/Tester";

export interface Ivariable {
    specFileList: IvariableBind<string[]>;
    userList: IvariableBind<string[]>;
    outputList: IvariableBind<modelTester.IserverDataOutput[]>;
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
