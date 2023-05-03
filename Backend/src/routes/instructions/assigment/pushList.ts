import { Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Symbol } from '../../symbols/symbol'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class PushList extends Instruction{
    private id:string
    private value:Expression

    constructor(id:string, value:Expression, line:number, column:number){
        super(line, column)
        this.id = id
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        const value = this.value.run(globalST, localST, methods, environment)
        let symbol = localST.get(this.id)

        if(symbol){
            this.checkPush(localST, symbol, value)
        }
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.checkPush(globalST, symbol, value)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }

    private checkPush(st:SymbolTable, symbol:Symbol, value:Value){
        let list = symbol.value
        if(value.type !== list[0].type){
            output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[value.type]} no se puede convertir a ${ValueType[list[0].type]} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Tipos incompatibles: ${ValueType[value.type]} no se puede convertir a ${ValueType[list[0].type]}.`, this.line, this.column)
        }
        list.push(value)
        st.upDate(this.id, list)
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_id = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.value.getAST(methods)
        const ast = `${id} [label="Añadir a Lista"];
        ${id_id} [label="Identificador ${this.id}"];
        ${id} -> ${id_id};
        ${value.ast}
        ${id} -> ${value.id}; `

        return {id: id, ast: ast}
    }
}