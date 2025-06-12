import { IvariableState } from "../JsMvcFwInterface";

// Source
import * as ModelTester from "../model/Tester";

export type IvariableList = {
    specFileList: IvariableState<string[]>;
    clientList: IvariableState<string[]>;
    serverDataOutput: IvariableState<ModelTester.IserverDataOutput[]>;
};
