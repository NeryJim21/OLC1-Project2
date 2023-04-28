"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = void 0;
const type_1 = require("./type");
const arithmetic_1 = require("../expressions/operators/arithmetic");
function getType(leftType, rightType, operator) {
    if (operator == arithmetic_1.ArithmeticType.SUM)
        return sum[leftType][rightType];
    else if (operator === arithmetic_1.ArithmeticType.SUBTRACCION)
        return substraccion[leftType][rightType];
    else if (operator === arithmetic_1.ArithmeticType.MULTIPLICATION)
        return multiplication[leftType][rightType];
    else if (operator === arithmetic_1.ArithmeticType.DIVISION)
        return divsion[leftType][rightType];
    else if (operator === arithmetic_1.ArithmeticType.POWER)
        return power[leftType][rightType];
    else if (operator === arithmetic_1.ArithmeticType.MODULE)
        return modules[leftType][rightType];
}
exports.getType = getType;
const sum = [
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.INT, type_1.ValueType.INT, type_1.ValueType.STRING, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.STRING, type_1.ValueType.NULL],
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.STRING, type_1.ValueType.NULL],
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.STRING, type_1.ValueType.STRING, type_1.ValueType.NULL],
    [type_1.ValueType.STRING, type_1.ValueType.STRING, type_1.ValueType.STRING, type_1.ValueType.STRING, type_1.ValueType.STRING, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL]
];
const substraccion = [
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.INT, type_1.ValueType.INT, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL]
];
const multiplication = [
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.INT, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL]
];
const divsion = [
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL]
];
const power = [
    [type_1.ValueType.INT, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL]
];
const modules = [
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.DOUBLE, type_1.ValueType.DOUBLE, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL],
    [type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL, type_1.ValueType.NULL]
];
