import { ToChar } from '../../expressions/nativeFunc/toChar'
import { Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { output, tokens } from '../../reports/report'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { Token } from '../../reports/token'
import { Error } from '../../reports/error'
import { defaultValue } from '../checks'
import { v4 as uuidv4 } from 'uuid'

export class NewList extends Instruction{
    private id: string
    private type:ValueType
    private type2:ValueType|null
    private value:Expression|null

    constructor(id: string, type:ValueType, type2:ValueType|null, value:Expression|null, line:number, column:number){
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

        let list:Array<Value> = []
        if(this.value instanceof ToChar){
            const aux = this.value.run(globalST, localST, methods, environment)
            this.toChar(list, aux.value)     
        }
        else{
            this.declarationDefault(list)
        }
        localST.add(ValueType.LIST, this.id, list )
        tokens.add(new Token(this.id, "Lista", ValueType[this.type], environment, this.line, this.column))
    
    }

    private toChar(list:Array<Value>, aux:any){
        if(this.type !== ValueType.CHAR){
            this.setError("CHAR", ValueType[this.type])
        }
        list.push(defaultValue(this.type))
        for(var i in aux){
            list.push({type:ValueType.CHAR, value: aux[i]})
        }
    }

    private declarationDefault(list:Array<Value>){
        if(this.type !== this.type2 && this.type2 !== null){
            this.setError(ValueType[this.type2], ValueType[this.type])
        }
        list.push(defaultValue(this.type))
    }

    private setError(type1:string, type2:string){
        output.setOutput(`-->Semántico, tipos incompatibles: ${type1} no puede convertirse a ${type2} (${this.line}:${this.column}).`)
        throw new Error("Semántico", `Tipos incompatibles: ${type1} no puede convertirse a ${type2}.`, this.line, this.column)    
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux = `n${uuidv4().replace(/\-/g, "")}`
        const ast = `${id} [label="Declaracion\\nLista"];
        ${aux} [label="Identificador\\n${this.id}"];
        ${id} -> ${aux};\n`
        
        return {id: id, ast: ast}
    }
}