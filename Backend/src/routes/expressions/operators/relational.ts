import { Node, Value, ValueType } from '../../types/type'
import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export enum RelationalType{
    GEQUALS,
    LEQUALS,
    NEQUALS,
    GREATER,
    EQUALS,
    LESS
}

export class Relational extends Expression{
    private type:RelationalType
    private left:Expression
    private right:Expression
    
    constructor(type:RelationalType, left:Expression, right:Expression, line:number, column:number){
        super(line,column);
        this.type = type
        this.left = left
        this.right = right
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        const leftV = this.left.run(globalST, localST, method, environment)
        const rightV = this.right.run(globalST, localST, method, environment)
        this.setError(leftV.type, rightV.type)
        
        switch(this.type){
            case RelationalType.GEQUALS:
                return {type: ValueType.BOOLEAN, value: (leftV.value >= rightV.value)}
            
            case RelationalType.LEQUALS:
                return {type: ValueType.BOOLEAN, value: (leftV.value <= rightV.value)}
            
            case RelationalType.NEQUALS:
                return {type: ValueType.BOOLEAN, value: (leftV.value != rightV.value)}
            
            case RelationalType.EQUALS:
                return {type: ValueType.BOOLEAN, value: (leftV.value === rightV.value)}
            
            case RelationalType.GREATER:
                return {type: ValueType.BOOLEAN, value: (leftV.value > rightV.value)}
            
            case RelationalType.LESS:
                return {type: ValueType.BOOLEAN, value: (leftV.value < rightV.value)}
        }
    }

    private setError(leftT:ValueType, rightT:ValueType){
        if(this.type !== RelationalType.EQUALS && this.type !== RelationalType.NEQUALS && 
            (leftT === ValueType.STRING || leftT === ValueType.BOOLEAN || 
            rightT === ValueType.STRING || rightT === ValueType.BOOLEAN)){

            output.setOutput(`-->Semántico, mala operación de tipos: ${RelationalType[this.type]}, entre: ${ValueType[leftT]} y ${ValueType[rightT]} (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Mala operación de tipos: ${RelationalType[this.type]}, entre: ${ValueType[leftT]} y ${ValueType[rightT]}.`, this.line, this.column)
        }
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const left = this.left.getAST(methods)
        const right = this.right.getAST(methods)
        const ast = `${id} [label="${this.getOperation()}"];
        ${left.ast}
        ${id} -> ${left.id};
        ${right.ast}
        ${id} -> ${right.id};\n`

        return {id: id, ast:ast}
    }

    private getOperation():string{
        switch(this.type){
            case RelationalType.EQUALS:
                return `Igual Igual\\n==`
            case RelationalType.NEQUALS:
                return `No Igual\\n!=`
            case RelationalType.GEQUALS:
                return `Mayor Igual\\n>=`
            case RelationalType.LEQUALS:
                return `Menor Igual\\n<=`
            case RelationalType.GREATER:
                return `Mayor\\n>`
            case RelationalType.LESS:
                return `Menor\\n<`
        }
    }
}