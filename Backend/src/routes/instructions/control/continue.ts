import { Instruction } from '../../types/instruction'
import { ControlType, Node } from '../../types/type'
import { v4 as uuidv4 } from 'uuid'

export class Continue extends Instruction{

    constructor(line:number, column:number){
        super(line, column)
    }

    public run(){
        return {type: ControlType.CONTINUE, line: this.line, column: this.column}
    }


    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const ast = `${id} [label="Continue"]; `
        return {id: id, ast: ast}
    }
}