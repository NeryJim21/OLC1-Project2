import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { ControlType, Node } from '../../types/type'
import { v4 as uuidv4 } from 'uuid'

export class Break extends Instruction{

    constructor(line:number, column:number){
        super(line, column)
    }

    public run(){
        return {type: ControlType.BREAK, line: this.line, column: this.column}
    }


    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const ast = `${id} [label="Break"]; `
        return {id: id, ast: ast}
    }
}