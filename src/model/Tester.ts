export interface Irequest {
    name: string;
    browser: string;
}

export interface IexecResponse {
    stdout: string;
    stderr: string | Error;
}

export interface IcallbackExec {
    (data: IexecResponse | boolean);
}
