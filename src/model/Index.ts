import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelTester from "../model/Tester";

export interface Ivariable {
    isLoading: IvariableBind<boolean>;
    userList: IvariableBind<string[]>;
    specFileList: IvariableBind<string[]>;
    outputList: IvariableBind<modelTester.Ioutput[]>;
    videoList: IvariableBind<string[]>;
    videoSrc: IvariableBind<string>;
}

export interface Imethod {
    onClickRun: (index: number, specFileName: string) => void;
    onClickLogRun: (index: number) => void;
    onClickVideoLoad: () => void;
    onClickVideoDelete: (event: Event, name: string) => void;
    onClickVideoShow: (name: string) => void;
}
