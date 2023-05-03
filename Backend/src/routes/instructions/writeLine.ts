import { SymbolTable } from '../symbols/symbolTable'
import { MethodTable } from '../symbols/methodTable'
import { Instruction } from '../types/instruction'
import { Expression } from '../types/expression'
import { output } from '../reports/report'
import { Node } from '../types/type'
import { v4 as uuidv4 } from 'uuid'

export class WriteLine extends Instruction{
    private expression:Expression|null

    constructor(expression:Expression|null, line:number, column:number){
        super(line, column)
        this.expression = expression
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string){
        if(this.expression instanceof Expression){
            const value = this.expression.run(globalST, localST, method, environment)
            output.setOutput(value.value)
        }
        else{
            output.setOutput("")
        }
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.getValue(methods)
        const ast = `${id} [label="WriteLine"];
        ${value.ast}
        ${id} -> ${value.id}; `
        
        return {id: id, ast: ast}
    }

    private getValue(methods:MethodTable):Node{
        if(this.expression){
            return this.expression.getAST(methods)
        }
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const ast = `${id} [label=""]; `
        return {id: id, ast: ast}
    }
}