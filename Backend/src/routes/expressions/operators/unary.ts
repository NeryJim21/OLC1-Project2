import { Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Expression } from '../../types/expression'
import { GetValue } from '../values/getValue'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export enum UnaryType {
    NEGATION,
    INCREMENT,
    DECREMENT
}

export class Unary extends Expression{
    private type:UnaryType
    private value:Expression

    constructor(type:UnaryType, value:Expression, line:number, column:number){
        super(line, column)
        this.type = type
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        if(this.type !== UnaryType.NEGATION && !(this.value instanceof GetValue)){
            output.setOutput(`-->Semántico, mala operación de tipo: ${UnaryType[this.type]} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Mala operación de tipo: ${UnaryType[this.type]}.`, this.line, this.column)
        }
        
        const value = this.value.run(globalST, localST, method, environment)

        if(value.type == ValueType.DOUBLE || value.type == ValueType.INT){
            switch(this.type){
                case UnaryType.NEGATION:
                    return {type: value.type, value: (-value.value)}
                
                case UnaryType.DECREMENT:
                    return {type: value.type, value: (value.value-1)}

                case UnaryType.INCREMENT:
                    return {type: value.type, value: (value.value+1)}
            }
        }
        
        output.setOutput(`-->Semántico, mala operación de tipo: ${UnaryType[this.type]}, a: ${ValueType[value.type]} (${this.line}:${this.column}).`)
        throw new Error("Semántico", `Mala operación de tipo: ${UnaryType[this.type]}, a: ${ValueType[value.type]}.`, this.line, this.column)
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.value.getAST(methods)
        const ast = `${id} [label="${this.getOperation()}"];
        ${value.ast}
        ${id} -> ${value.id};\n`

        return {id: id, ast:ast}
    }

    private getOperation(){
        switch(this.type){
            case UnaryType.DECREMENT:
                return `Decremento\\n--`
            case UnaryType.INCREMENT:
                return `Incremento\\n++`
            case UnaryType.NEGATION:
                return `Negacion Unaria\\n-`
        }
    }

}