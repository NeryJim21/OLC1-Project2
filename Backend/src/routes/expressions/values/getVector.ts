import { Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Symbol } from '../../symbols/symbol'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class GetVector extends Expression{
    private id:string
    private index:Expression

    constructor(id:string, index:Expression, line:number, column:number){
        super(line, column)
        this.id = id
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
            this.checkVector(symbol.type)
            return this.getValue(symbol, index.value)
        }
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.checkVector(symbol.type)
                return this.getValue(symbol, index.value)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }

    private checkVector(type:ValueType){
        if(type !== ValueType.VECTOR){
            output.setOutput(`-->Semántico, vector requerido, pero no enontrado (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Vector requerido, pero no enontrado.`, this.line, this.column)
        }
    }

    private getValue(symbol:Symbol, index:number):Value{
        let vector = symbol.value
        if(index < 0 || index > vector.length){
            output.setOutput(`-->Semántico, indice fuera de rango en: ${this.id}[] (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Indice fuera de rango en: ${this.id}[].`, this.line, this.column)
        }
        return vector[index]
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_id = `n${uuidv4().replace(/\-/g, "")}`
        const index_id = `n${uuidv4().replace(/\-/g, "")}`
        const index = this.index.getAST(methods)
        const ast = `${id} [label="Vector"];
        ${id_id} [label="Identificador ${this.id}[]"];
        ${id} -> ${id_id};
        ${index_id} [label="Indice"];
        ${id} -> ${index_id};
        ${index.ast}
        ${index_id} -> ${index.id}; `

        return {id: id, ast: ast}
    }
}