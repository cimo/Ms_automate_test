import { IrequestBody } from "./Helper";

export interface Irequest extends IrequestBody {
    browser: string;
    mode: string;
    name: string;
}
