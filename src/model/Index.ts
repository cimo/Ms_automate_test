import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelTester from "../model/Tester";

export interface Ivariable {
    userList: IvariableBind<string[]>;
    specFileList: IvariableBind<string[]>;
    outputList: IvariableBind<modelTester.Ioutput[]>;
    isLoading: IvariableBind<boolean>;
}

export interface Imethod {
    onClickExecute: (index: number, specFileName: string) => void;
    onClickLog: (index: number) => void;
}
