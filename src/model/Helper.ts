export interface IresponseBody {
    response: {
        stdout: string;
        stderr: string | Error;
    };
}

export interface IresponseExec {
    stdout: string;
    stderr: string | Error;
}

export interface IcallbackExec {
    (data: boolean);
}
