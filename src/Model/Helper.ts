export interface IcircularReplacer {
    (key: string, value: string): string | null;
}

export interface IrequestBody {
    token_api: string;
}

export interface IresponseExecute {
    response: {
        stdout: string;
        stderr: string;
    };
}
