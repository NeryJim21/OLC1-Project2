import { ValueType } from "../types/type";
import { Symbol } from "./symbol";

export class SymbolTable {
    private _symbols:Symbol[]

    constructor(symbols:Symbol[]){
        this._symbols = []
        this._symbols = this._symbols.concat(symbols)
    }

    public add(type:ValueType, id:string, value:any){
        this._symbols.push(new Symbol(type, id, value))
    }

    public get(id:string){
        var symbol = this._symbols.filter((symbol:Symbol)=>symbol.id==id)[0]
        if(symbol) return symbol
        else return null
    }

    public upDate(id:string, value:any){
        var symbol:Symbol = this._symbols.filter((symbol:Symbol)=>symbol.id==id)[0]
        if(symbol) symbol.value = value
    }

    get symbols(){
        return this._symbols
    }
}