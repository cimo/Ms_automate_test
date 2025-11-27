import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";
import { ImessageDirect } from "@cimo/websocket/dist/src/client/Model";

// Source
import * as modelTester from "../model/Tester";

export interface Ivariable {
    isLoading: IvariableBind<boolean>;
    clientList: IvariableBind<string[]>;
    specFileList: IvariableBind<string[]>;
    outputList: IvariableBind<modelTester.Ioutput[]>;
    videoList: IvariableBind<string[]>;
    videoSrc: IvariableBind<string>;
    uploadFileName: IvariableBind<string>;
    isChatVisible: IvariableBind<boolean>;
    clientIdSelected: IvariableBind<string>;
    chatMessageList: IvariableBind<ImessageDirect[]>;
    isClientConnected: IvariableBind<boolean>;
    clientIdCurrent: IvariableBind<string | undefined>;
}

export interface Imethod {
    onClickRun: (index: number, specFileName: string) => void;
    onClickLogRun: (index: number) => void;
    onClickVideoLoad: () => void;
    onClickVideoShow: (name: string) => void;
    onClickVideoDelete: (index: number, name: string) => void;
    onClickChooseFile: () => void;
    onClickUpload: () => void;
    onClickClient: (index: number, clientId: string) => void;
    onSendChatMessage: () => void;
    onClickChatClose: () => void;
    onClickConnect: () => void;
    onErrorVideo: () => void;
}

export interface IelementHook extends Record<string, Element | Element[]> {
    selectBrowserName: HTMLSelectElement[];
    inputVideoName: HTMLInputElement;
    inputSpecUpload: HTMLInputElement;
    inputChatMessageSend: HTMLTextAreaElement;
}
