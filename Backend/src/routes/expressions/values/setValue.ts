import { Node, Value, ValueType } from '../../types/type'
import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { v4 as uuidv4 } from 'uuid'

export class SetValue extends Expression{
    private type:ValueType
    private value:any

    constructor(type:ValueType, value:any, line:number, column: number){
        super(line, column);
        this.type = type
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        if(this.type === ValueType.STRING || this.type === ValueType.CHAR){
            const value = this.value.replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/\\'/g,"\'").replace(/\\\\/g,"\\").replace(/\\"/g,"\"")
            return {type: this.type, value: value}
        }
        
        return {type: this.type, value: this.value}
    }    

    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let value = this.value
        if(this.type === ValueType.STRING || this.type === ValueType.CHAR){
            value = this.value.replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/\\'/g,"\'").replace(/\\\\/g,"\\").replace(/\\"/g,"\"")
        }
        const ast = `${id} [label="${this.getType()} ${value}"]; `

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