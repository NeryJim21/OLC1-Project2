import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { ControlType, Node } from '../../types/type'
import { Expression } from '../../types/expression'
import { v4 as uuidv4 } from 'uuid'

export class Return extends Instruction{

    constructor(private value:Expression|null, line:number, column:number){
        super(line, column)
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        if(this.value === null){
            return {type: ControlType.RETURN, value: null, line: this.line, column: this.column}
        }

        const value = this.value.run(globalST, localST, methods, environment)
        return {type: ControlType.RETURN, value: value, line: this.line, column: this.column}
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Return"]; `
        if(this.value){
            const value = this.value.getAST(methods)
            ast += `${value.ast}
            ${id} -> ${value.id}; `
        }
        return {id: id, ast: ast}
    }
}