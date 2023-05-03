import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Instruction } from '../../types/instruction'
import { Node, ValueType } from '../../types/type'
import { output } from '../../reports/report'
import { Symbol } from '../../symbols/symbol'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export enum AssigType{
    DECREMENT,
    INCREMENT
}

export class AssingCrement extends Instruction{

    private id:string
    private type:AssigType

    constructor(id:string, type:AssigType, line:number, column:number){
        super(line, column)
        this.id = id
        this.type = type
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string) {
        var symbol = localST.get(this.id)
        
        if(symbol){
            this.setDI(symbol, localST)
        } 
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.setDI(symbol, globalST)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }
    
    private setDI(symbol:Symbol, st:SymbolTable){
        if(symbol.type === ValueType.INT || symbol.type === ValueType.DOUBLE){
            if(this.type === AssigType.DECREMENT){
                st.upDate(this.id, symbol.value-1)
            }
            else{
                st.upDate(this.id, symbol.value+1)
            }
            return
        }
        this.setError(symbol.type)
    }

    private setError(type:ValueType){
        output.setOutput(`-->Semántico, mala operación de tipo: ${AssigType[this.type]}, a: ${ValueType[type]} (${this.line}:${this.column}).`)
        throw new Error("Semántico", `Mala operación de tipo: ${AssigType[this.type]}, a: ${ValueType[type]}.`, this.line, this.column)
    }

    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux1 = `n${uuidv4().replace(/\-/g, "")}`
        const aux2 = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.getType()
        const ast = `${id} [label="${value.type}"];
        ${aux1} [label="Identificador ${this.id}"];
        ${id} -> ${aux1};
        ${aux2} [label="${value.sub}"];
        ${id} -> ${aux2}; `

        return {id: id, ast: ast}
    }

    private getType(){
        switch(this.type){
            case AssigType.DECREMENT:
                return {type: `DEC`, sub: `Decremento --`}
            case AssigType.INCREMENT:
                return {type: `INC`, sub: `Incremento ++`}
        }
    }

}