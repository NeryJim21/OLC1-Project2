import { ControlType, Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class If extends Instruction {
    private condition:Expression
    private body:Instruction[]
    private elseC:Instruction[]

    constructor(condition:Expression, body:Instruction[], elseC:Instruction[], line:number, column:number){
        super(line, column)
        this.condition = condition
        this.body = body
        this.elseC = elseC
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        const condition = this.condition.run(globalST, localST, methods, environment)
        this.setError(condition)
        var control

        if(condition.value){
            control = this.runInstrucctions(globalST, localST, methods, environment+'_if', this.body)
        }
        else if(this.elseC){
            if(this.elseC instanceof Instruction){
                control = this.elseC.run(globalST, localST, methods, environment+'_else')
            }
            else{
                control = this.runInstrucctions(globalST, localST, methods, environment+'_else', this.elseC)
            }
        }

        //Sentencias de Control
        if(control !== null && control !== undefined){
            if(control.type === ControlType.RETURN){
                return control
            }
        }
    }

    private setError(condition:Value){
        if(condition.type != ValueType.BOOLEAN){
            output.setOutput(`->Semántico, condicion no es de tipo BOOLEAN (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Condicion no es de tipo BOOLEAN.`, this.line, this.column)
        }
    }

    private runInstrucctions(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string, body:Instruction[]):any{
        var localST2 = new SymbolTable(localST.symbols)
        for(var i in body){
            const control = body[i].run(globalST, localST2, methods, environment)
            if(control !== null && control !== undefined){
                return control
            }
        }
        return null
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const value = this.condition.getAST(methods)
        const body = this.getBody(methods, this.body)
        let ast = `${value.ast}
        ${id} -> ${value.id};
        ${body.ast}
        ${id} -> ${body.id}; `

        if(this.elseC instanceof Instruction){
            const elseif = this.elseC.getAST(methods)
            ast += `${elseif.ast}
            ${elseif.id} [label="Else If"];
            ${id} -> ${elseif.id}; `
        }
        else{
            if(this.elseC){
                const elseb = this.getBody(methods, this.elseC)
                const id_else = `n${uuidv4().replace(/\-/g, "")}`
                ast += `${elseb.ast}
                ${id_else} [label="Else"];
                ${id_else} -> ${elseb.id};
                ${id} -> ${id_else}; `
            }
        }

        ast = `${id} [label="If"];
        ${ast}`

        return {id: id, ast: ast}
    }

    private getBody(methods:MethodTable, body:Instruction[]):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Cuerpo"]; `
        for(var i in body){
            const aux = body[i].getAST(methods)
            ast += `${aux.ast}
            ${id} -> ${aux.id}; `
        }
        return {id: id, ast: ast}
    }
}

