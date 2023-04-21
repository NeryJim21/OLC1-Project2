import { Node, Value, ValueType } from '../../types/type'
import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { v4 as uuidv4 } from 'uuid'

export class TypeOf extends Expression {
    private value:Expression
    
    constructor(value:Expression, line:number, column:number){
        super(line, column)
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        const value = this.value.run(globalST, localST, method, environment)
        return {type: ValueType.STRING, value: ValueType[value.type]}
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.value.getAST(methods)
        const ast = `${id} [label="TypeOf"];
        ${value.ast}
        ${id} -> ${value.id};\n`

        return {id: id, ast:ast}
    }    
        
}