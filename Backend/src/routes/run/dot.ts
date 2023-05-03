import { MethodTable } from "../symbols/methodTable"
import { Instruction } from "../types/instruction"

export function getDOT(ast:any, methods:MethodTable, id:string){
    let dot:string = ``
    for(const instruction of ast){
        if(instruction instanceof Instruction){
            const aux = instruction.getAST(methods)
            dot += `${aux.ast}
            ${id} -> ${aux.id}; `
        }
    }
    return dot
}