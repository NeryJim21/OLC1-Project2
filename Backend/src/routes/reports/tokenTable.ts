import { Token } from './token'

export class TokenTable{
    private _tokens:Token[]

    constructor(){
        this._tokens = []
    }

    clear(){
        this._tokens = []
    }

    add(token:Token){
        this._tokens.push(token)
    }

    get(){
        return this._tokens
    }
}