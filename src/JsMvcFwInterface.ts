export interface IvirtualNode {
    tag: string;
    property: { [key: string]: string | number | boolean | null | ((event: Event) => void) | Array<IvirtualNode | string> | undefined };
    children: Array<IvirtualNode | string>;
}

export interface IbindVariable<T> {
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
