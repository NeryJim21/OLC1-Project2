import { Main } from '../instructions/functions/main'
import { MethodTable } from '../symbols/methodTable'
import { SymbolTable } from '../symbols/symbolTable'
import { Instruction } from '../types/instruction'
import { errors, output } from '../reports/report'
import { Error } from '../reports/error'

export function getAST(ast:any, globalST:SymbolTable, methods:MethodTable){
    const main:any[] = []
    for(const instruction of ast){
        try {
            if(instruction instanceof Instruction)
                instruction.run(globalST, globalST, methods, "-")
            
            else if(instruction instanceof Main)
                instruction.run(main)
            
        } catch (error) {
            if(error instanceof Error) errors.add(error)
        }
    }
    return main
}

export function runMain(main:any, globalST:SymbolTable, localST:SymbolTable, methods:MethodTable){
    if(main.length === 1){
        main[0].run(globalST, localST, methods, main[0].id)
    }
    else if(main.length > 1){
        output.setOutput(`-->Semántico, solo puede existir un metodo main (${main[1].line}:${main[1].column}).`)
        throw new Error(`Semántico`, `Solo puede existir un metodo main`, main[1].line, main[1].column)
    }
    else if(main.length < 1){
        output.setOutput(`-->Semántico, debe de existir un metodo main.`)
        throw new Error(`Semántico`, `Debe de existir un metodo main`, 0, 0)
    }
}