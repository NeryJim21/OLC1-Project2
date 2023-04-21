import { Node, Value, ValueType } from '../../types/type'
import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { Expression } from '../../types/expression'
import { getType } from '../../types/typesTable'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'


export enum ArithmeticType {
    SUM,
    SUBTRACCION,
    MULTIPLICATION,
    DIVISION,
    POWER,
    MODULE
}

export class Arithmetic extends Expression {
    private type:ArithmeticType
    private left:Expression
    private right:Expression

    constructor(type:ArithmeticType, left:Expression, right:Expression, line:number, column:number){
        super(line, column)
        this.type = type
        this.left = left
        this.right = right
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):Value{
        let leftV = this.left.run(globalST, localST, method, environment)
        let rightV = this.right.run(globalST, localST, method, environment)
        const newType = getType(leftV.type, rightV.type, this.type)
        
        switch(this.type){
            case ArithmeticType.SUM:
                switch(newType){
                    case ValueType.INT:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        return {type: ValueType.INT, value: (Number(leftV.value) + Number(rightV.value))}

                    case ValueType.DOUBLE:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        return {type: ValueType.DOUBLE, value: (Number(leftV.value) + Number(rightV.value))}

                    case ValueType.STRING:
                        return {type: ValueType.STRING, value: (leftV.value + rightV.value)}
                }
            
            case ArithmeticType.SUBTRACCION:
                switch(newType){
                    case ValueType.INT:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        return {type: ValueType.INT, value: (Number(leftV.value) - Number(rightV.value))}

                    case ValueType.DOUBLE:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        return {type: ValueType.DOUBLE, value: (Number(leftV.value) - Number(rightV.value))}
                }

            case ArithmeticType.MULTIPLICATION:
                switch(newType){
                    case ValueType.INT:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        return {type: ValueType.INT, value: (Number(leftV.value) * Number(rightV.value))}

                    case ValueType.DOUBLE:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        return {type: ValueType.DOUBLE, value: (Number(leftV.value) * Number(rightV.value))}
                }
            
            case ArithmeticType.DIVISION:
                switch(newType){
                    case ValueType.DOUBLE:
                        leftV = this.getAscii(leftV)
                        rightV = this.getAscii(rightV)
                        if(Number(rightV.value) !== 0){
                            return {type: ValueType.DOUBLE, value: (Number(leftV.value) / Number(rightV.value))}
                        }
                        output.setOutput(`-->Semántico, no se puede realizar división entre 0 (${this.line}:${this.column}).`)
                        throw new Error("Semántico", `No se puede realizar división entre 0.`, this.line, this.column)
                }

            case ArithmeticType.POWER:
                switch(newType){
                    case ValueType.INT:
                        return {type: ValueType.INT, value: (Number(leftV.value) ** Number(rightV.value))}

                    case ValueType.DOUBLE:
                        return {type: ValueType.DOUBLE, value: (Number(leftV.value) ** Number(rightV.value))}
                }
            
            case ArithmeticType.MODULE:
                switch(newType){
                    case ValueType.DOUBLE:
                        return {type: ValueType.DOUBLE, value: (Number(leftV.value) % Number(rightV.value))}
                }            
        }

        output.setOutput(`-->Semántico, mala operación de tipos: ${ArithmeticType[this.type]}, entre: ${ValueType[leftV.type]} y ${ValueType[rightV.type]} (${this.line}:${this.column}).`)
        throw new Error("Semántico", `Mala operación de tipos: ${ArithmeticType[this.type]}, entre: ${ValueType[leftV.type]} y ${ValueType[rightV.type]}.`, this.line, this.column)
    }

    private getAscii(value:Value):Value{
        if(value.type === ValueType.CHAR){
            return {type: ValueType.INT, value: value.value.charCodeAt(0)}
        }
        return value
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
            case ArithmeticType.SUM:
                return `Suma\\n+`
            case ArithmeticType.SUBTRACCION:
                return `Resta\\n-`
            case ArithmeticType.MULTIPLICATION:
                return `Multiplicación\\n*`
            case ArithmeticType.DIVISION:
                return `División\\n/`
            case ArithmeticType.MODULE:
                return `Módulo\\n%`
            case ArithmeticType.POWER:
                return `Potencia\\n^`
        }
    }

}