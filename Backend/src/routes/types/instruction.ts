import { SymbolTable } from '../symbols/symbolTable'
import { MethodTable } from '../symbols/methodTable'
import { Node } from './type'

export abstract class Instruction{
    public line:number
    public column:number

    constructor(line:number, column:number) {
        this.line = line
        this.column = column
    }

    public abstract run(globalST:SymbolTable, localST:SymbolTable, method:MethodTable, environment:string):any

    public abstract getAST(methods:MethodTable):Node

}