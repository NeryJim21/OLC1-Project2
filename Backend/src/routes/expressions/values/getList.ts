import { Node, Value, ValueType } from '../../types/type'
import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { Symbol } from '../../symbols/symbol'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class GetList extends Expression {
    private id:string
    private index:Expression

    constructor(id:string, index:Expression, line:number, column:number){
        super(line, column)
        this.id = id;
        this.index = index
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string):Value{
        const index = this.index.run(globalST, localST, methods, environment)
        if(index.type !== ValueType.INT){
            output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[index.type]} no se puede convertir a INT (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Tipos incompatibles: ${ValueType[index.type]} no se puede convertir a INT.`, this.line, this.column)
        }
        var symbol = localST.get(this.id)
        
        if(symbol){
            this.checkList(symbol.type)
            return this.getValue(symbol, index.value+1)
        }
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.checkList(symbol.type)
                return this.getValue(symbol, index.value+1)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }

    private checkList(type:ValueType){
        if(type !== ValueType.LIST){
            output.setOutput(`-->Semántico, lista requerida, pero no enontrada (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Lista requerida, pero no enontrada.`, this.line, this.column)
        }
    }

    private getValue(symbol:Symbol, index:number):Value{
        let list = symbol.value
        if(index < 1 || index > list.length){
            output.setOutput(`-->Semántico, indice fuera de rango en: ${this.id} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Indice fuera de rango en: ${this.id}.`, this.line, this.column)
        }
        return list[index]
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_id = `n${uuidv4().replace(/\-/g, "")}`
        const index_id = `n${uuidv4().replace(/\-/g, "")}`
        const index = this.index.getAST(methods)
        const ast = `${id} [label="Lista"];
        ${id_id} [label="Identificador\\n${this.id}"];
        ${id} -> ${id_id};
        ${index_id} [label="Indice"];
        ${id} -> ${index_id};
        ${index.ast}
        ${index_id} -> ${index.id};\n`

        return {id: id, ast: ast}
    }
}