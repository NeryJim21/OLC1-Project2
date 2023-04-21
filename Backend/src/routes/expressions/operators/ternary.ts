import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Node, Value, ValueType } from '../../types/type'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class Ternary extends Expression {
    private condition:Expression
    private trueV:Expression
    private falseV:Expression
    
    constructor(condition:Expression, trueV:Expression, falseV:Expression, line:number, column:number){
        super(line, column)
        this.condition = condition
        this.trueV = trueV
        this.falseV = falseV
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        const condition = this.condition.run(globalST, localST, method, environment)
        if(condition.type !== ValueType.BOOLEAN){
            output.setOutput(`-->Semántico, condición de Ternario no es de tipo BOOLEAN (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Condición de Ternario no es de tipo BOOLEAN.`, this.line, this.column)
        }
        
        if(condition.value){
            return this.trueV.run(globalST, localST, method, environment)
        } 
        else{
            return this.falseV.run(globalST, localST, method, environment)
        } 
    }
    
    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const vtrue = this.getTrue(methods)
        const vfalse = this.getFalse(methods)
        const condition = this.getCondition(methods)
        const ast = `${id} [label="Ternario"];
        ${condition.ast}
        ${id} -> ${condition.id};
        ${vtrue.ast}
        ${id} -> ${vtrue.id};
        ${vfalse.ast}
        ${id} -> ${vfalse.id};\n`

        return {id: id, ast:ast}
    }
    
    private getCondition(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const condition = this.condition.getAST(methods)
        const ast = `${id} [lable="Condicion"];
        ${condition.ast}
        ${id} -> ${condition.id};\n`

        return {id: id, ast:ast}
    }

    private getTrue(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const vtrue = this.trueV.getAST(methods)
        const ast = `${id} [label="Valor\\nVerdadero"];
        ${vtrue.ast}
        ${id} -> ${vtrue.id};\n`

        return {id: id, ast:ast}
    }

    private getFalse(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const vfalse = this.falseV.getAST(methods)
        const ast = `${id} [label="Valor\\nFalso"];
        ${vfalse.ast}
        ${id} -> ${vfalse.id};\n`

        return {id: id, ast:ast}
    }
}