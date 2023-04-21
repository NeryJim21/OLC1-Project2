import { ControlType, Node, ValueType } from '../../types/type'
import { MethodTable } from '../../symbols/methodTable'
import { SymbolTable } from '../../symbols/symbolTable'
import { Instruction } from '../../types/instruction'
import { Expression } from '../../types/expression'
import { output } from '../../reports/report'
import { Method } from '../../symbols/method'
import { Error } from '../../reports/error'
import { v4 as uuidv4 } from 'uuid'

export class CallMethod extends Instruction{
    private id:string
    private atributes:Expression[]

    constructor(id:string, atributes:Expression[], line:number, column:number){
        super(line, column)
        this.id = id
        this.atributes = atributes
    }

    public run(globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        const method = methods.get(this.id)
        if(method){
            if(method.type === ValueType.VOID){
                if(method.parameters.length === this.atributes.length){
                    var localST2 = this.getLocalST(method, globalST, localST, methods, environment)
                    const control = this.runMethod(method.body, globalST, localST2, methods, this.id)
                    // Manejo de retornos
                    if(control != null && control != undefined){
                        if(control.type == ControlType.RETURN){
                            if(control.vulue === null) return 
                            
                            this.setError(`No se puede retornar tipo ${ValueType[control.value.type]} en método VOID.`, control.line, control.column)
                        }
                    }
                    return
                }
                else if(method.parameters.length >= this.atributes.length){
                    this.setError(`Muy pocos atributos, esperados: ${method.parameters.length}, obtenidos:${this.atributes.length}.`, this.line, this.column)
                }
                else {
                    this.setError(`Muchos atributos, esperados: ${method.parameters.length}, obtenidos:${this.atributes.length}.`, this.line, this.column)
                }
            }
            this.setError(`Método VOID no asignado de forma correcta.`, this.line, this.column)
        }
        this.setError(`No existe el método: ${this.id}.`, this.line, this.column)
    }

    private getLocalST(method:Method, globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string):SymbolTable{
        var localST2 = new SymbolTable([]);
        for(var i in this.atributes){
            var value = this.atributes[i].run(globalST, localST, methods, environment)
            if(value.type === method.parameters[i].type){
                if(value.type === ValueType.LIST && value.value[0].type !== method.parameters[i].type2){
                    this.setError(`Tipo de atributo: ${ValueType[value.value[0].type]}, no coincide con: ${ ValueType[method.parameters[i].type2]}.`, this.line, this.column)
                }
                else if(value.type === ValueType.VECTOR && value.value[0].type !== method.parameters[i].type2){
                    this.setError(`Tipo de atributo: ${ValueType[value.value[0].type]}[], no coincide con: ${ ValueType[method.parameters[i].type2]}[].`, this.line, this.column)
                }
                localST2.add(value.type, method.parameters[i].id, value.value)
            }
            else{
                this.setError(`Tipo de atributo: ${ValueType[value.type]}, no coincide con: ${ ValueType[method.parameters[i].type]}.`, this.line, this.column)
            }
        }
        return localST2
    }

    private runMethod(body:Instruction[], globalST:SymbolTable, localST:SymbolTable, methods:MethodTable, environment:string){
        for(var i in body){
            const control = body[i].run(globalST, localST, methods, environment)
            if(control !== null && control !== undefined ){
                return control
            }
        }
        return null
    }

    private setError(msg:string, line:number, column:number){
        output.setOutput(`-->Semántico, ${msg} (${line}:${column}).`)
        throw new Error(`Semántico`, msg, line, column)
    }


    public getAST(methods:MethodTable):Node{
        const temp = new MethodTable(methods.methods)

        const method = methods.get(this.id)
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Llamada Metodo\\n${this.id}"];\n`

        if(this.atributes.length !== 0){
            const aux = this.getAtributes(methods)
            ast += `${aux.ast}
            ${id} -> ${aux.id};\n`
        }

        if(method && method.body.length !== 0){
            const body = method.body
            temp.clearBody(this.id)
            const id_body = `n${uuidv4().replace(/\-/g, "")}`
            ast += `${id_body} [label="Cuerpo"];
            ${id} -> ${id_body};\n`

            for(var i in body){
                const aux = body[i].getAST(temp)
                ast += `${aux.ast}
                ${id_body} -> ${aux.id};\n`
            }
        }

        return {id: id, ast: ast}
    }

    private getAtributes(methods:MethodTable):Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        let ast = `${id} [label="Atributos"];\n`

        for(var i in this.atributes){
            const aux = this.atributes[i].getAST(methods)
            ast += `${aux.ast}
            ${id} -> ${aux.id};\n`
        }

        return {id: id, ast: ast}
    }
}