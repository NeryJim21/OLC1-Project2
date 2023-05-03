import { ControlType, Node, Value } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'
import { Case } from './case'
import { throws } from 'assert'

export class Switch extends Instruction{
    private condition:Expression
    private body:Case[]
    private def:Instruction[]

    constructor(condition:Expression, body:Case[], def:Instruction[], line:number, column:number){
        super(line, column)
        this.condition = condition
        this.body = body
        this.def = def
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        const condition = this.condition.run(globalST, localST, methods, environment)
        var control = this.runCase(condition, globalST, localST, methods, environment)
        
        if(control === null){
            control = this.runBody(this.def, globalST, localST, methods, environment)
        }

        if(control !== null){
            if(control.type === ControlType.CONTINUE){
                output.setOutput(`-->Semántico, CONTINUE fuera de ciclo (${control.line}:${control.column}).`)
                throw new Error("Semántico", `CONTINUE fuera de ciclo.`, control.line, control.column)
            }
            else if(control.type === ControlType.RETURN){
                return control
            }
        }
    }

    private runCase(condition:Value, globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        let flag = false
        for(var i in this.body){
            const value = this.body[i].value.run(globalST, localST, methods, environment)
            if((value.value === condition.value) || flag){
                flag = true
                const control = this.runBody(this.body[i].body, globalST, localST, methods, environment+"_case")
                if(control !== null) return control
            }
        }
        return null
    }

    private runBody(body:Instruction[], globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
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
        const body = this.getBody(methods)
        const ast = `${id} [label="Switch"];
        ${value.ast}
        ${id} -> ${value.id};
        ${body.ast}
        ${id} -> ${body.id}; `
        
        return {id: id, ast: ast}
    }

    private getBody(methods:MethodTable){
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Cuerpo"]; `
        for(var i in this.body){
            const aux = this.body[i].getAST(methods)
            ast += `${aux.ast}
            ${id} -> ${aux.id}; `
        }
        if(this.def){
            const aux = `n${uuidv4().replace(/\-/g, "")}`
            ast += `${aux} [label="Default"]; 
            ${id} -> ${aux}; `
            for(var i in this.def){
                const def = this.def[i].getAST(methods)
                ast += `${def.ast}
                ${aux} -> ${def.id}; `
            }

        }

        return {id: id, ast: ast}
    }
}