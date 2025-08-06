export interface IvirtualNode {
    tag: string;
    propertyObject: { [key: string]: TvirtualNodeProperty };
    childrenList: Array<IvirtualNode | string>;
    key?: string;
}

export interface IvariableBind<T> {
    state: T;
    listener(callback: (value: T) => void): void;
}

export interface IvariableState<T> {
    value: T;
    setValue: (value: T) => void;
}

export interface Icontroller {
    getName(): string;
    variable(): void;
    variableLoaded(): void;
    view(): IvirtualNode;
    event(): void;
    destroy(): void;
    subControllerList(): Icontroller[];
}

export interface IcontrollerOption {
    parent: Icontroller;
    childrenList: Icontroller[];
}

export interface Irouter {
    title: string;
    path: string;
    controller(): Icontroller;
}

export type TvirtualNodeProperty = string | number | boolean | (string | IvirtualNode)[] | ((event: Event) => void) | null | undefined;

export type TvirtualNodeChildren = IvirtualNode | string | number;
