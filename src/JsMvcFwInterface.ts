export interface IvirtualNode {
    tag: string;
    propertyObject: { [key: string]: TvirtualNodeProperty };
    children: Array<IvirtualNode | string>;
}

export interface IvirtualNodeObject {
    [key: string]: IvirtualNode;
}

export interface ItriggerRenderObject {
    [key: string]: () => void;
}

export interface IvariableBind<T> {
    state: T;
    listener(callback: (value: T) => void): void;
}

export interface IvariableBindOption {
    controllerName: string;
    state: unknown;
    isLoaded: boolean;
}

export interface IvariableBindCountObject {
    [key: string]: {
        countLoaded: number;
        countTotal: number;
    };
}

export interface IvariableState<T> {
    value: T;
    setValue: (value: T) => void;
}

export interface IvariableStateObject {
    [key: string]: unknown;
}

export interface Icontroller {
    name(): string;
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
