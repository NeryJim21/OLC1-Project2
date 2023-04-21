import { Node, Value, ValueType } from '../../types/type'
import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export enum LogicalType{
    AND,
    NOT,
    OR
}

export class Logical extends Expression{
    private type:LogicalType
    private left:Expression
    private right:Expression|null

    constructor(type:LogicalType, left:Expression, right:Expression|null, line:number, column:number){
        super(line,column);
        this.type = type
        this.left = left
        this.right = right
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        const leftV = this.left.run(globalST, localST, method, environment)
        const rightV = this.getRightV(globalST, localST, method, environment)
        this.setError(leftV.type, rightV.type)

        switch(this.type){
            case LogicalType.AND:
                return {type: ValueType.BOOLEAN, value:(leftV.value && rightV.value)}
            
            case LogicalType.NOT:
                return {type: ValueType.BOOLEAN, value:(!leftV.value)}

            case LogicalType.OR:
                return {type: ValueType.BOOLEAN, value:(leftV.value || rightV.value)}
        }
    }

    private getRightV(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        if(this.right !== null && this.type !== LogicalType.NOT){
            return this.right.run(globalST, localST, method, environment)
        }
        return {type: ValueType.NULL, value: null}
        
    }

    private setError(leftT:ValueType, rightT:ValueType){
        if(leftT !== ValueType.BOOLEAN && rightT !== ValueType.BOOLEAN && this.type !== LogicalType.NOT){
            output.setOutput(`-->Semántico, mala operación de tipos: ${LogicalType[this.type]}, entre: ${ValueType[leftT]} y ${ValueType[rightT]} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Mala operación de tipos: ${LogicalType[this.type]}, entre: ${ValueType[leftT]} y ${ValueType[rightT]}.`, this.line, this.column)
        }
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const left = this.left.getAST(methods)
        let ast = `${id} [label="${this.getOperation()}"];
        ${left.ast}
        ${id} -> ${left.id};\n`

        if(this.right !== null){
            const right = this.right.getAST(methods)
            ast += `${right.ast}
            ${id} -> ${right.id};\n`
        }
        
        return {id: id, ast:ast}
    }

    private getOperation():string{
        switch(this.type){
            case LogicalType.AND:
                return `And\\n&&`
            case LogicalType.OR:
                return `Or\\n||`
            case LogicalType.NOT:
                return `Not\\n!`
        }
    }
}