export interface IcircularReplacer {
    (key: string, value: string): string | null;
}

export interface IrequestBody {
    token_api: string;
    mode?: string;
    browser?: string;
}

export interface IresponseBody {
    response: {
        stdout: string;
        stderr: string | Error;
    };
}
