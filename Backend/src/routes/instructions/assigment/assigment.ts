import { SymbolTable } from '../../symbols/symbolTable'
import { MethodTable } from '../../symbols/methodTable'
import { checkEstructure, checkType } from '../checks'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Symbol } from '../../symbols/symbol'
import { Node, Value} from '../../types/type'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class Assigment extends Instruction{

    private id:string
    private value:Expression

    constructor(id:string, value:Expression, line:number, column:number){
        super(line, column)
        this.id = id
        this.value = value
    }

    public run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string) {
        const value = this.value.run(globalST, localST, method, environment)
        var symbol = localST.get(this.id)
        
        if(symbol){
            this.updateValue(localST, symbol, value)
        }
        else{
            symbol = globalST.get(this.id)
            if(symbol){
                this.updateValue(globalST, symbol, value)
            }
            else{
                output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`)
                throw new Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column)
            }
        }
    }

    private updateValue(st:SymbolTable, symbol:Symbol, value:Value){
        checkEstructure(symbol, value.type, this.line, this.column)
        const aux = checkType(symbol.type, value, this.line, this.column)
        st.upDate(this.id, aux.value)
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.value.getAST(methods)
        const ast = `${id} [label="Asignacion Variable"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux};
        ${value.ast}
        ${id} -> ${value.id}; `

        return {id: id, ast: ast}
    }
}