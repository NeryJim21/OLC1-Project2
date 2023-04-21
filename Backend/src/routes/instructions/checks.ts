import { Value, ValueType } from '../types/type'
import { Symbol } from '../symbols/symbol'
import { output } from '../reports/report'
import { Error } from '../reports/error'

export function defaultValue(type: ValueType):Value{
    if(type === ValueType.INT){
        return {type: ValueType.INT, value: 0}
    }
    else if(type === ValueType.DOUBLE){
        return {type: ValueType.DOUBLE, value: 0.0}
    }
    else if(type === ValueType.BOOLEAN){
        return {type: ValueType.BOOLEAN, value: true}
    }
    else if(type === ValueType.CHAR){
        return {type: ValueType.CHAR, value: "0"}
    }
    return {type: ValueType.STRING, value: ""}
}

export function checkType(type:ValueType, value:Value, line:number, column:number):Value{
    if(type === value.type){
        return value
    }
    else if(type === ValueType.DOUBLE){
        if(value.type === ValueType.INT){
            return {type: type, value: value.value}
        }
    }
    else if(type === ValueType.INT){
        if(value.type === ValueType.BOOLEAN){
            if(value.value === true){
                return {type: type, value: 1}
            }
            else if(value.value === false){
                return {type: type, value: 0}
            }
        }
        else if(value.type === ValueType.CHAR){
            return {type: type, value: value.value.charCodeAt(0)}
        }
        else if(value.type === ValueType.DOUBLE){
            return {type: type, value: Math.trunc(value.value)}
        }
    }
    output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[value.type]} no se puede convertir a ${ValueType[type]} (${line}:${column}).`)
    throw new Error("Semántico", `Tipos incompatibles: ${ValueType[value.type]} no se puede convertir a ${ValueType[type]}.`, line, column)
}

export function checkEstructure(symbol:Symbol, type:ValueType, line:number, column:number){
    if(symbol.type === ValueType.VECTOR || symbol.type === ValueType.LIST){
        output.setOutput(`-->Semántico, tipos incompatibles: ${ValueType[type]} no se puede convertir a ${ValueType[symbol.value[0].type]}[] (${line}:${column}).`)
        throw new Error("Semántico", `Tipos incompatibles: ${ValueType[type]} no se puede convertir a ${ValueType[symbol.value[0].type]}[].`, line, column)
    }
}

export function checkIndex(index:number, vector:any, id:string, line:number, column:number){
    if(index < 0 || index > vector.length){
        output.setOutput(`-->Semántico, indice fuera de rango en: ${id}[] (${line}:${column}).`)
        throw new Error("Semántico", `Indice fuera de rango en: ${id}[].`, line, column)
    }
}