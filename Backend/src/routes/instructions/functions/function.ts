import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Parameters } from './parameters'
import { Node, ValueType } from '../../types/type'
import { tokens } from '../../reports/report'
import { Token } from '../../reports/token'
import { v4 as uuidv4 } from 'uuid'

export class Function extends Instruction{
    private type:ValueType
    private id:string
    public parameters:Parameters[]
    public body:Instruction[]

    constructor(type:ValueType, id:string, parameters:Parameters[], body:Instruction[], line:number, column:number){
        super(line, column)
        this.type = type
        this.id = id
        this.parameters = parameters
        this.body = body
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string) {
        method.add(this.type, this.id, this.parameters, this.body)
        tokens.add(new Token(this.id, "Método", ValueType[this.type], environment, this.line, this.column))
    }


    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_id = `n${uuidv4().replace(/\-/g, "")}`
        const parameters = this.getParameter()
        let ast = `${id} [label="Declaracion\\nFuncion ${this.getType()}"];
        ${id_id} [label="Identificador\\n${this.id}"];
        ${id} -> ${id_id};\n`

        if(this.parameters.length !== 0){
            const parameters = this.getParameter()
            ast += `${parameters.ast}
            ${id} -> ${parameters.id};\n`
        }

        return {id: id, ast: ast}
    }

    private getParameter():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Parametros"];\n`
        for(var i in this.parameters){
            const par = this.parameters[i].getAST()
            ast += `${par.ast}
            ${id} -> ${par.id};\n`
        }
        
        return {id: id, ast: ast}
    }

    private getType():string{
        switch(this.type){
            case ValueType.VOID:
                return `Void`
            case ValueType.STRING:
                return `String`
            case ValueType.CHAR:
                return `Char`
            case ValueType.INT:
                return `Int`
            case ValueType.DOUBLE:
                return `Double`
            case ValueType.BOOLEAN:
                return `Boolean`
            default:
                return ``
        }
    }
}
