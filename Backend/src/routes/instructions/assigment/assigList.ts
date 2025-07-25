import { Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Symbol } from '../../symbols/symbol'
import { Error } from '../../reports/error'
import { checkType } from '../checks'
import { v4 as uuidv4 } from 'uuid'

export class AssigList extends Instruction{
    private id:string
    private index:Expression
    private value:Expression

    constructor(id:string, index:Expression, value:Expression, line:number, column:number){
        super(line, column)
        this.id = id
        this.index = index
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        let index = this.index.run(globalST, localST, methods, environment)
        if(index.type !== ValueType.INT){
            output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[index.type]} no se puede convertir a INT (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Tipos incompatibles: ${ValueType[index.type]} no se puede convertir a INT.`, this.line, this.column)
        }
        const value = this.value.run(globalST, localST, methods, environment)
        let symbol = localST.get(this.id)

        if(symbol){
            this.checkUpdate(localST, symbol, value, index.value+1)
        }
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.checkUpdate(globalST, symbol, value, index.value+1)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }

    private checkUpdate(st:SymbolTable, symbol:Symbol, value:Value, index:number){
        let list = symbol.value
        if(symbol.type !== ValueType.LIST){
            output.setOutput(`-->Semántico, lista requerida, pero no enontrada (${this.line}:${this.column}).`)
            throw new Error(`Semántico`, `Lista requerida, pero no enontrada.`, this.line, this.column)
        }
        if(index < 1 || index > list.length){
            output.setOutput(`-->Semántico, indice fuera de rango en: ${this.id}[] (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Indice fuera de rango en: ${this.id}[].`, this.line, this.column)
        }
        const aux = checkType(list[0].type, value, this.line, this.column)
        
        list[index] = aux
        st.upDate(this.id, list)  
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_id = `n${uuidv4().replace(/\-/g, "")}`
        const index = this.getIndex(methods)
        const value = this.value.getAST(methods)
        
        const ast = `${id} [label="Asignacion Lista"];
        ${id_id} [label="Identificador ${this.id}"];
        ${id} -> ${id_id};
        ${index.ast}
        ${id} -> ${index.id};
        ${value.ast}
        ${id} -> ${value.id}; `

        return {id: id, ast: ast}
    }

    private getIndex(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const index = this.index.getAST(methods)
        const ast = `${id} [label="Indice"];
        ${index.ast}
        ${id} -> ${index.id}`
    
        return {id: id, ast: ast}
    }
}