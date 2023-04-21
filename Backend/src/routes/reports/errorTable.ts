import { Error } from './error'

export class ErrorTable{
    private _errors:Error[]

    constructor(){
        this._errors = []
    }

    clear(){
        this._errors = []
    }

    add(error:Error){
        this._errors.push(error)
    }

    get(){
        return this._errors
    }
}