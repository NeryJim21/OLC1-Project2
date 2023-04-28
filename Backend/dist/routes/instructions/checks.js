"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIndex = exports.checkEstructure = exports.checkType = exports.defaultValue = void 0;
const type_1 = require("../types/type");
const report_1 = require("../reports/report");
const error_1 = require("../reports/error");
function defaultValue(type) {
    if (type === type_1.ValueType.INT) {
        return { type: type_1.ValueType.INT, value: 0 };
    }
    else if (type === type_1.ValueType.DOUBLE) {
        return { type: type_1.ValueType.DOUBLE, value: 0.0 };
    }
    else if (type === type_1.ValueType.BOOLEAN) {
        return { type: type_1.ValueType.BOOLEAN, value: true };
    }
    else if (type === type_1.ValueType.CHAR) {
        return { type: type_1.ValueType.CHAR, value: "0" };
    }
    return { type: type_1.ValueType.STRING, value: "" };
}
exports.defaultValue = defaultValue;
function checkType(type, value, line, column) {
    if (type === value.type) {
        return value;
    }
    else if (type === type_1.ValueType.DOUBLE) {
        if (value.type === type_1.ValueType.INT) {
            return { type: type, value: value.value };
        }
    }
    else if (type === type_1.ValueType.INT) {
        if (value.type === type_1.ValueType.BOOLEAN) {
            if (value.value === true) {
                return { type: type, value: 1 };
            }
            else if (value.value === false) {
                return { type: type, value: 0 };
            }
        }
        else if (value.type === type_1.ValueType.CHAR) {
            return { type: type, value: value.value.charCodeAt(0) };
        }
        else if (value.type === type_1.ValueType.DOUBLE) {
            return { type: type, value: Math.trunc(value.value) };
        }
    }
    report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[value.type]} no se puede convertir a ${type_1.ValueType[type]} (${line}:${column}).`);
    throw new error_1.Error("Semántico", `Tipos incompatibles: ${type_1.ValueType[value.type]} no se puede convertir a ${type_1.ValueType[type]}.`, line, column);
}
exports.checkType = checkType;
function checkEstructure(symbol, type, line, column) {
    if (symbol.type === type_1.ValueType.VECTOR || symbol.type === type_1.ValueType.LIST) {
        report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[type]} no se puede convertir a ${type_1.ValueType[symbol.value[0].type]}[] (${line}:${column}).`);
        throw new error_1.Error("Semántico", `Tipos incompatibles: ${type_1.ValueType[type]} no se puede convertir a ${type_1.ValueType[symbol.value[0].type]}[].`, line, column);
    }
}
exports.checkEstructure = checkEstructure;
function checkIndex(index, vector, id, line, column) {
    if (index < 0 || index > vector.length) {
        report_1.output.setOutput(`-->Semántico, indice fuera de rango en: ${id}[] (${line}:${column}).`);
        throw new error_1.Error("Semántico", `Indice fuera de rango en: ${id}[].`, line, column);
    }
}
exports.checkIndex = checkIndex;
