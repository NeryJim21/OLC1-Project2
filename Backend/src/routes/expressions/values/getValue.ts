import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { Node, Value } from '../../types/type'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class GetValue extends Expression{
    private id:string

    constructor(id:string, line:number, column:number){
        super(line, column);
        this.id = id
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value {
        const value = localST.get(this.id)
        if(value === null){
            const value = globalST.get(this.id)
            if(value === null){
                output.setOutput(`-->Semántico, no se puedo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se puedo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
            
            return {type: value.type, value: value.value}
        }
        return {type: value.type, value: value.value}
    }

    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const ast = `${id} [label="Identificador ${this.id}"]; `

        return {id: id, ast: ast}
    }
}