export interface IvirtualNodeProps {
    children?: Array<IvirtualNode | string>;
    [key: string]: string | number | boolean | null | ((event: Event) => void) | Array<IvirtualNode | string> | undefined;
}

export interface IvirtualNode {
    type: string;
    props: IvirtualNodeProps;
    children: Array<IvirtualNode | string>;
}

export interface IvariableState<T> {
    state: T;
    listener(callback: (value: T) => void): void;
}

export interface Icontroller {
    variable(): void;
    view(): IvirtualNode;
    event(): void;
    destroy(): void;
}

export interface Irouter {
    title: string;
    path: string;
    controller(): Icontroller;
}
