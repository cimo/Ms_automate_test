export interface IvariableState<T> {
    state: T;
    // Listener ora non più necessario perché useremo Proxy
    // Listener lasciato per retrocompatibilità o eventuali hooks esterni
    listener?: (callback: (value: T) => void) => void;
}

// Tipicamente controller lavora con oggetti che hanno variabili osservate via Proxy
export interface Icontroller<T = Record<string, IvariableState<unknown>>> {
    variable: () => T;
    view: (variableList: T) => string;
    event: (variableList: T) => void;
    destroy: (variableList: T) => void;
}

export interface Irouter {
    title: string;
    path: string;
    controller(): Icontroller;
}

export interface Iview {
    template: string;
}
