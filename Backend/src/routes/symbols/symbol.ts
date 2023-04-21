import { Value, ValueType } from "../types/type"

export class Symbol{
    public type:ValueType
    public id:string|null
    public value:any

    constructor(type:ValueType, id:string|null, value:any){
        this.type = type
        this.id = id
        this.value = value
    }
}