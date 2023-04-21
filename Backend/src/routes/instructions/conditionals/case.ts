import { MethodTable } from '../../symbols/methodTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { Node } from '../../types/type'
import { v4 as uuidv4 } from 'uuid'


export class Case {

    public value:Expression
    public body:Instruction[]

    constructor(value:Expression, body:Instruction[], line:number, column:number){
        this.value = value
        this.body = body
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.value.getAST(methods)
        const body = this.getBody(methods)
        const ast = `${id} [label="Case"];
        ${value.ast}
        ${id} -> ${value.id};
        ${body.ast}
        ${id} -> ${body.id};\n`
        
        return {id: id, ast: ast}
    }

    private getBody(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Cuerpo"];\n`
        for(var i in this.body){
            const aux = this.body[i].getAST(methods)
            ast += `${aux.ast}
            ${id} -> ${aux.id};\n`
        }

        return {id: id, ast: ast}
    }
}