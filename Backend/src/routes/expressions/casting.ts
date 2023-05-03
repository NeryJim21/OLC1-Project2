import { Node, Value, ValueType } from '../types/type'
import { SymbolTable } from '../symbols/symbolTable'
import { MethodTable } from '../symbols/methodTable'
import { Expression } from '../types/expression'
import { output } from '../reports/report'
import { Error } from '../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class Casting extends Expression {
    private type:ValueType
    private value:Expression

    constructor(type:ValueType, value:Expression, line:number, column:number){
        super(line, column)
        this.type = type
        this.value = value
    }

    public run(globlaST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string):Value{
        const value = this.value.run(globlaST, localST, methods, environment)
        switch(this.type){
            case ValueType.INT:
                switch (value.type){
                    case ValueType.INT:
                        return {type: this.type, value: value.value}

                    case ValueType.DOUBLE:
                        return {type: this.type, value: Math.trunc(value.value)}

                    case ValueType.CHAR:
                        return {type: this.type, value: (value.value).charCodeAt(0)}
                }
            
            case ValueType.DOUBLE:
                switch(value.type){
                    case ValueType.INT:
                        return {type: this.type, value: value.value}

                    case ValueType.DOUBLE:
                        return {type: this.type, value: value.value}

                    case ValueType.CHAR:
                        return {type: this.type, value: (value.value).charCodeAt(0)}
                }
            
            case ValueType.CHAR:
                switch(value.type){
                    case ValueType.INT:
                        return {type: this.type, value: String.fromCharCode(value.value)}

                    case ValueType.CHAR:
                        return {type: this.type, value: value.value}
                }

            case ValueType.BOOLEAN:
                switch(value.type){
                    case ValueType.BOOLEAN:
                        return {type: this.type, value: value.value}
                }

            case ValueType.STRING:
                switch(value.type){
                    case ValueType.STRING:
                        return {type: this.type, value: value.value}
                }
        }

        output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[value.type]} no se puede convertir a ${ValueType[this.type]} (${this.line}:${this.column}).`)
        throw new Error("Semántico", `Tipos incompatibles: ${ValueType[value.type]} no se puede convertir a ${ValueType[this.type]}.`, this.line, this.column)
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.value.getAST(methods)
        const ast = `${id} [label="Casteo ${this.getType()}"];
        ${value.ast}
        ${id} -> ${value.id}; `

        return {id: id, ast: ast}
    }

    private getType():string{
        switch (this.type){
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
        }
        return ``
    }
}