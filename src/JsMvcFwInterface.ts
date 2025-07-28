export interface IvirtualNode {
    tag: string;
    property: { [key: string]: TvirtualNodeProperty };
    children: Array<IvirtualNode | string>;
}

export interface IbindVariable<T> {
    state: T;
    listener(callback: (value: T) => void): void;
}

export interface Icontroller {
    name(): string;
    variable(): void;
    view(): IvirtualNode;
    event(): void;
    destroy(): void;
    subControllerList?(): Icontroller[];
}

export interface Irouter {
    title: string;
    path: string;
    controller(): Icontroller;
}

export type TvirtualNodeProperty = string | number | boolean | (string | IvirtualNode)[] | ((event: Event) => void) | null | undefined;

export type TvirtualNodeChildren = IvirtualNode | string | number;
