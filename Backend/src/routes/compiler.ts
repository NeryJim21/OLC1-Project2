import { MethodTable } from './symbols/methodTable'
import { SymbolTable } from './symbols/symbolTable'
import { output, clearAll, errors} from './reports/report'
import { getAST, runMain } from './run/run'
import { getDOT } from './run/dot'
import { v4 as uuidv4 } from 'uuid'
import { Error } from './reports/error'

const parser = require('./grammar/grammar')
let main:any[] = []
let methods:MethodTable
let ast:any

export function run(input:any):any{
    clearAll()
    const globalST = new SymbolTable([])
    const localST = new SymbolTable([])
    methods = new MethodTable([])
    main = []
    
    try {
        ast = parser.parse(input.toString())
        main = getAST(ast, globalST, methods)

        runMain(main, globalST, localST, methods)
    }
    catch (error) {
        if(error instanceof Error) errors.add(error)
        console.log(error)
    }
    return output.getOutput()
}

export function getDot(){
    const id = `n${uuidv4().replace(/\-/g, "")}`
    let dot = `node [shape=box];${id} [label="AST"];${getDOT(ast, methods, id)}`

    if(main.length === 1){
        const value = main[0].getAST(methods)
        const id_main = `n${uuidv4().replace(/\-/g, "")}`

        dot += `${id_main} [label="MAIN"];${id} -> ${id_main} ${id_main} -> ${value.id}; ${value.ast} `

        return `digraph G { ${dot.replace(/\n/g, "").replace(/\\/g, "")} }`
    }
    return `digraph G { ${dot.replace(/\n/g, "").replace(/\\/g, "")} }`
}