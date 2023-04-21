import { ControlType, Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class For extends Instruction {
    private declaration:Expression
    private condition:Expression
    private update:Expression
    private body:Expression[]

    constructor(declaration:Expression, condition:Expression, update:Expression, body:Instruction[], line:number, column:number){
        super(line, column)
        this.declaration = declaration
        this.condition = condition
        this.update = update
        this.body = body
    }
    
    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        var localST2 = new SymbolTable(localST.symbols)
        
        this.declaration.run(globalST, localST2, methods, environment+'_for')
        var condition = this.condition.run(globalST, localST2, methods, environment)
        this.setError(condition)
        
        while(condition.value){
            var localST3 = new SymbolTable(localST2.symbols)
            
            const control = this.runInstrucctions(globalST, localST3, methods, environment+'_for')
            //Sentencias de control
            if(control !== null){
                if(control.type === ControlType.BREAK){
                    break
                }
                else if(control.type === ControlType.CONTINUE){
                    this.update.run(globalST, localST, methods, environment)
                    condition = this.condition.run(globalST, localST3, methods, environment)
                    continue
                }
                else if(control.type === ControlType.RETURN){
                    return control
                }
            }

            this.update.run(globalST, localST3, methods, environment)
            condition = this.condition.run(globalST, localST3, methods, environment)
            this.setError(condition)
        }
    }

    private setError(condition:Value){
        if(condition.type != ValueType.BOOLEAN){
            output.setOutput(`-->Semántico, condicion no es de tipo BOOLEAN (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Condicion no es de tipo BOOLEAN.`, this.line, this.column)
        }
    }

    private runInstrucctions(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string):any{
        for(var i in this.body){
            const control = this.body[i].run(globalST, localST, methods, environment)
            if(control !== null && control !== undefined){
                return control
            }
        }
        return null
    }

    public getAST(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const aux1 = this.getConditions(methods)
        const aux2 = this.getBody(methods)
        const ast = `${id} [label="For"];
        ${aux1.ast}
        ${id} -> ${aux1.id}
        ${aux2.ast}
        ${id} -> ${aux2.id}`
        return {id: id, ast: ast}
    }

    private getConditions(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const declaration = this.declaration.getAST(methods)
        const condition = this.condition.getAST(methods)
        const update = this.update.getAST(methods)

        const ast = `${id} [label="Condicion"];
        ${declaration.ast}
        ${id} -> ${declaration.id};
        ${condition.ast}
        ${id} -> ${condition.id};
        ${update.ast}
        ${id} -> ${update.id};\n`

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