export interface IvirtualNodeProps {
    [key: string]: string | number | boolean | null;
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
    view(): () => string;
    event(): void;
    destroy(): void;
}

export interface Irouter {
    title: string;
    path: string;
    controller(): Icontroller;
}
