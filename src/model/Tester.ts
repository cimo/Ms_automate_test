export interface IclientDataRun {
    index: number;
    name: string;
    browser: string;
}

export interface IclientDataRunLog {
    index: number;
}

export interface IclientDataStop {
    index: number;
}

export interface IclientDataVideo {
    name: string;
}

export interface IserverData {
    status: string;
    result: string | string[] | IserverDataOutput[];
}

export interface IserverDataOutput {
    status: string;
    browser: string;
    time: string;
    log: string;
}

export interface IserverDataRun extends IserverData {
    index: number;
}

export interface IserverDataBroadcast extends IserverData {
    tag: string;
}
