import {Parameters } from '../instructions/functions/parameters'
import {Instruction} from '../types/instruction'
import { ValueType } from '../types/type'
import {Method} from './method'

export class MethodTable{
    private _methods:Method[]

    constructor(methods:Method[]){
        this._methods = []
        this._methods = this._methods.concat(methods)
    }

    public add(type:ValueType, id:string, parameters:Parameters[], body:Instruction[]){
        this._methods.push(new Method(type, id, parameters, body))
    }

    public get(id:string){
        var method = this._methods.filter((method:Method)=>method.id==id)[0]
        if(method){
            return method
        }
        return null
    }
    
    public clearBody(id:string){
        var method:Method = this._methods.filter((method:Method)=>method.id==id)[0]
        if(method) method.body = []
    }

    get methods() {
        return this._methods
    }
}