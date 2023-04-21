import { Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { checkIndex, checkType } from '../checks'
import { output } from '../../reports/report'
import { Symbol } from '../../symbols/symbol'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class AssigVector extends Instruction{
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
        const index = this.index.run(globalST, localST, methods, environment)
        if(index.type !== ValueType.INT){
            output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[index.type]} no se puede convertir a INT (${this.line}:${this.column}).`)
            throw new Error(`Semántico`, `Tipos incompatibles: ${ValueType[index.type]} no se puede convertir a INT.`, this.line, this.column)
        }
        const value = this.value.run(globalST, localST, methods, environment)
        let symbol = localST.get(this.id)

        if(symbol){
            this.checkUpdate(localST, symbol, value, index.value)
        }
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.checkUpdate(globalST, symbol, value, index.value)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }

    private checkUpdate(st:SymbolTable, symbol:Symbol, value:Value, index:number){
        let vector = symbol.value
        if(symbol.type !== ValueType.VECTOR){
            output.setOutput(`-->Semántico, vector requerido, pero no enontrado (${this.line}:${this.column}).`)
            throw new Error(`Semántico`, `Vector requerido, pero no enontrado.`, this.line, this.column)
        }
        checkIndex(index, vector, this.id, this.line, this.column)
        const aux = checkType(vector[0].type, value, this.line, this.column)
        
        vector[index] = aux
        st.upDate(this.id, vector)  
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_id = `n${uuidv4().replace(/\-/g, "")}`
        const index = this.getIndex(methods)
        const value = this.value.getAST(methods)
        
        const ast = `${id} [label="Asignacion\\nVector"];
        ${id_id} [label="Identificador\\n${this.id}[]"];
        ${id} -> ${id_id};
        ${index.ast}
        ${id} -> ${index.id};
        ${value.ast}
        ${id} -> ${value.id};\n`

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

