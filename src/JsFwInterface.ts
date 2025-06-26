export interface IvNodeProps {
    [key: string]: string | number | boolean | null;
}

export interface IvNode {
    type: string;
    props: IvNodeProps;
    children: Array<IvNode | string>;
}

export interface IvariableStateA<T> {
    state: T;
    listener: (callback: (value: T) => void) => void;
}

export interface IviewA {
    template: string;
}

export interface IcontrollerA {
    variable: () => void;
    view: () => void;
    event: () => void;
    destroy: () => void;
}

/*export interface IrouterA {
    title: string;
    path: string;
    controller(): IcontrollerA;
}*/
