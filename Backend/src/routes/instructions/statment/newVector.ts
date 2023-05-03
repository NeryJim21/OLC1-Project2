import { ToChar } from '../../expressions/nativeFunc/toChar'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Node, Value, ValueType } from '../../types/type'
import { Instruction } from '../../types/instruction'
import { output, tokens } from '../../reports/report'
import { Expression } from '../../types/expression'
import { checkType, defaultValue } from '../checks'
import { Error } from '../../reports/error'
import { Token } from '../../reports/token'
import { v4 as uuidv4 } from 'uuid'

export class NewVector extends Instruction {
    private id:string
    private type:ValueType
    private type2:ValueType|null
    private value:Expression|Expression[]

    constructor(id:string, type:ValueType, type2:ValueType, value:Expression|Expression[], line:number, column:number){
        super(line, column)
        this.id = id
        this.type = type
        this.type2 = type2
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        var aux = localST.get(this.id)
        
        if(aux){
            output.setOutput(`-->Semántico, la variable ya se encuentra definida: ${this.id} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `La variable ya se encuentra definida: ${this.id}.`, this.line, this.column)
        }
        let vector:Array<Value> = []
        
        if(this.value instanceof ToChar){
            const aux = this.value.run(globalST, localST, methods, environment)
            this.toChar(vector, aux.value)     
        }
        else if(this.value instanceof Expression){
            const size = this.value.run(globalST, localST, methods, environment)     
            this.declarationDefault(vector, size)
        }
        else{
            this.declaration2(globalST, localST, methods, environment, vector, this.value)
        }
        localST.add(ValueType.VECTOR, this.id, vector )
        tokens.add(new Token(this.id, "Vector", ValueType[this.type], environment, this.line, this.column))
    }

    private toChar(vector:Array<Value>, aux:any){
        if(this.type !== ValueType.CHAR){
            this.setError("CHAR", ValueType[this.type])
        }
        for(var i in aux){
            vector.push({type:ValueType.CHAR, value: aux[i]})
        }
    }

    private declarationDefault(vector:Array<Value>, size:Value){
        if(this.type !== this.type2 && this.type2 !== null){
            this.setError(ValueType[this.type2], ValueType[this.type])
        }   
        if(size.type !== ValueType.INT){
            this.setError(ValueType[this.type], "INT")
        }
        for(var i = 0; i < size.value; i++){
            vector.push(defaultValue(this.type))
        }
    }

    private declaration2(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string, vector:Array<Value>, expression:Expression[]){
        for(var i in expression){
            const aux = expression[i].run(globalST, localST, methods, environment)
            const value = checkType(this.type, aux, this.line, this.column)
            vector.push(value)
        }
    }

    private setError(type1:string, type2:string){
        output.setOutput(`-->Semántico, tipos incompatibles: ${type1}[] no puede convertirse a ${type2}[] (${this.line}:${this.column}).`)
        throw new Error("Semántico", `Tipos incompatibles: ${type1}[] no puede convertirse a ${type2}[].`, this.line, this.column)    
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.getValue(methods)
        const ast = `${id} [label="Declaracion nVector"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux};
        ${value.ast}
        ${id} -> ${value.id}; `
        
        return {id: id, ast: ast}
    }

    private getValue(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Valores"]; `
        if(this.value instanceof ToChar){
            const value = this.value.getAST(methods)
            ast += `${value.ast}
            ${id} -> ${value.id}; `
            return {id: id, ast: ast}    
        }
        else if(this.value instanceof Expression){
            return {id: id, ast: ast}
        }
        else{
            for(var i in this.value){
                const aux = this.value[i].getAST(methods)
                ast += `${aux.ast}
                ${id} -> ${aux.id}; `
            }
            return {id: id, ast: ast}
        }
    }
}
