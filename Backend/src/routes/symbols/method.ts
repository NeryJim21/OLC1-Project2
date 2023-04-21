import { ValueType } from '../types/type'
import { Instruction } from '../types/instruction'

export class Method{
    public type:ValueType
    public id:string
    public parameters:any[]
    public body:Instruction[]

    constructor(type:ValueType, id:string, parameters:any[], body:Instruction[]){
        this.type = type
        this.id = id
        this.parameters = parameters
        this.body = body
    }
}