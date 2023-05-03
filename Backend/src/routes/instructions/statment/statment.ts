import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { output, tokens } from '../../reports/report'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { checkType, defaultValue } from '../checks'
import { Node, ValueType } from '../../types/type'
import { Token } from '../../reports/token'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class Statment extends Instruction{

    private type: ValueType
    private id:string
    private value:Expression|null

    constructor(type: ValueType, id:string, value:Expression|null, line:number, column:number){
        super(line, column)
        this.type = type
        this.id = id
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string) {
        this.setStatment(this.id, globalST, localST, method, environment)
    }

    private setStatment(id:string, globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string){
        const aux = localST.get(id)
 
        if(aux){
            output.setOutput(`-->Semántico, la variable ya se encuentra definida: ${id} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `La variable ya se encuentra definida: ${id}.`, this.line, this.column)
        }
        var value
        if(this.value){
            value = this.value.run(globalST, localST, method, environment)
        }
        else{
            value = defaultValue(this.type)
        }

        value = checkType(this.type, value, this.line, this.column)
        localST.add(this.type, id, value.value )
        tokens.add(new Token(id, "Variable", ValueType[value.type], environment, this.line, this.column))

    }

    
    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.getValue(methods)
        const ast = `${id} [label="Declaracion Variable"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux};
        ${value.ast}
        ${id} -> ${value.id}; `
        
        return {id: id, ast: ast}
    }

    private getValue(methods:MethodTable):Node{
        if(this.value){
            return this.value.getAST(methods)
        }
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const value = defaultValue(this.type)
        const ast = `${id} [label="${this.getType(value.type)} ${value.value}"]; `

        return {id: id, ast: ast}
    }
    
    private getType(type: ValueType):string{
        switch (type){
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