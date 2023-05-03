import { Node, ValueType } from '../../types/type'
import { v4 as uuidv4 } from 'uuid'

export class Parameters{
    public type:ValueType
    public type2:ValueType|null
    public id:string

    constructor(type:ValueType, type2:ValueType|null, id:string){
        this.type = type
        this.type2 = type2
        this.id = id
    }

    public getAST():Node{
        const id = `n${uuidv4().replace(/\-/g, "")}`
        const id_type = `n${uuidv4().replace(/\-/g, "")}`
        const ast = `${id} [label="Identificador ${this.id}"];
        ${id_type} [label="${this.getType(this.type)}"];
        ${id} -> ${id_type}; `

        return {id: id, ast: ast}
    }

    private getType(type:ValueType):string{
        let type2
        switch(type){
            case ValueType.STRING:
                return `String`
            case ValueType.CHAR:
                return `Char`
            case ValueType.INT:
                return `Int`
            case ValueType.DOUBLE:
                return `Double`
            case ValueType.BOOLEAN:
                return `Boolean`
            case ValueType.LIST:
                if(this.type2) type2 = this.getType(this.type2)
                return `Lista ${type2}`
            case ValueType.VECTOR:
                if(this.type2) type2 = this.getType(this.type2)
                return `Vector ${type2}`
            default:
                return ``
        }
    }
}