import { ControlType, Node, Value, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class While extends Instruction {

    constructor(private condition:Expression, private body:Instruction[], line:number, column:number){
        super(line, column)
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        var condition = this.condition.run(globalST, localST, methods, environment)
        this.setError(condition)
        
        while(condition.value){
            var localST2 = new SymbolTable(localST.symbols)
            const control = this.runInstrucctions(globalST, localST2, methods, environment+'_while')
            //Sentencias de control
            if(control !== null){
                if(control.type === ControlType.BREAK){
                    break
                }
                else if(control.type === ControlType.CONTINUE){
                    condition = this.condition.run(globalST, localST, methods, environment)
                    continue
                }
                else if(control.type === ControlType.RETURN){
                    return control
                }
            }
            condition = this.condition.run(globalST, localST, methods, environment)
            this.setError(condition)
        }
    }

    private setError(condition:Value){
        if(condition.type != ValueType.BOOLEAN){
            output.setOutput(`-->Semántico, condicion de if no es de tipo BOOLEAN (${this.line}:${this.column}).`)
            throw new Error("Semántico", `Condicion de if no es de tipo BOOLEAN`, this.line, this.column)
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
        const aux = `n${uuidv4().replace(/\-/g, "")}`
        const condition = this.condition.getAST(methods)
        let ast = `${id} [label="While"];
        ${condition.ast}
        ${id} -> ${condition.id};
        ${aux} [label="Cuepo"];
        ${id} -> ${aux};\n`

        for(var i in this.body){
            const temp = this.body[i].getAST(methods)
            ast += `${temp.ast}
            ${aux} -> ${temp.id};\n`
        }

        return {id: id, ast: ast}
    }
}