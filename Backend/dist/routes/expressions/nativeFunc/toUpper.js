"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToUpper = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class ToUpper extends expression_1.Expression {
    constructor(value, line, column) {
        super(line, column);
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        const value = this.value.run(globalST, localST, method, environment);
        if (value.type !== type_1.ValueType.STRING) {
            report_1.output.setOutput(`-->Semántico, TOUPPER no es aplicable a tipo: ${type_1.ValueType[value.type]} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `TOUPPER no es aplicable a tipo: ${type_1.ValueType[value.type]}.`, this.line, this.column);
        }
        return { type: type_1.ValueType.STRING, value: ((value.value).toUpperCase()) };
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="ToUpper"];
        ${value.ast}
        ${id} -> ${value.id};\n`;
        return { id: id, ast: ast };
    }
}
exports.ToUpper = ToUpper;
