import { IrequestBody } from "./Helper";

export interface Irequest extends IrequestBody {
    name: string;
    browser: string;
}

export interface Iresponse {
    stdout: string;
    stderr: string;
}
