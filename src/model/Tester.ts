export interface Ioutput {
    browser: string;
    phase: string;
    time: string;
    log: string;
}

export interface IclientDataRun extends Record<string, unknown> {
    index: number;
    specFileName: string;
    browser: string;
}

export interface IclientDataStop extends Record<string, unknown> {
    index: number;
}

export interface IclientDataLog extends Record<string, unknown> {
    index: number;
}

export interface IclientDataVideo {
    name: string;
}

export interface IserverData extends Record<string, unknown> {
    status: string;
    result: string | string[] | Ioutput[];
}

export interface IserverDataBroadcast extends IserverData {
    tag: string;
}
