export enum ValueType {
    INT =       0,
    DOUBLE =    1,
    BOOLEAN =   2,
    CHAR =      3,
    STRING =    4,
    NULL =      5,
    VOID =      6,
    VECTOR =    7,
    LIST =      8
}

export type Value = {
    type:ValueType,
    value:any
}

export enum ControlType {
    BREAK =       0,
    RETURN =    1,
    CONTINUE =   2
}

export type Node = {
    id:string,
    ast:string
}