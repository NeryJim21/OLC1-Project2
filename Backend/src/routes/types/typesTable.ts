import { ValueType,  } from "./type";
import { ArithmeticType } from "../expressions/operators/arithmetic";

export function getType(leftType:ValueType, rightType:ValueType, operator:ArithmeticType) {
    if(operator == ArithmeticType.SUM) return sum[leftType][rightType]
    else if(operator === ArithmeticType.SUBTRACCION) return substraccion[leftType][rightType]
    else if(operator === ArithmeticType.MULTIPLICATION) return multiplication[leftType][rightType]
    else if(operator === ArithmeticType.DIVISION) return divsion[leftType][rightType]
    else if(operator === ArithmeticType.POWER) return power[leftType][rightType]
    else if(operator === ArithmeticType.MODULE) return modules[leftType][rightType]
}

const sum = [
    [ValueType.INT, ValueType.DOUBLE, ValueType.INT, ValueType.INT, ValueType.STRING, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.DOUBLE, ValueType.DOUBLE, ValueType.STRING, ValueType.NULL],
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.STRING, ValueType.NULL],
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.STRING, ValueType.STRING, ValueType.NULL],
    [ValueType.STRING, ValueType.STRING, ValueType.STRING, ValueType.STRING, ValueType.STRING, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL]    
]

const substraccion = [
    [ValueType.INT, ValueType.DOUBLE, ValueType.INT, ValueType.INT, ValueType.NULL, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL],
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL]    
]

const multiplication = [
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.INT, ValueType.NULL, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL]    
]

const divsion = [
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL]    
]

const power = [
    [ValueType.INT, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL]    
]

const modules = [
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.DOUBLE, ValueType.DOUBLE, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL],
    [ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL, ValueType.NULL]    
]