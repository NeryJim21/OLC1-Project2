"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unary = exports.UnaryType = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const getValue_1 = require("../values/getValue");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
var UnaryType;
(function (UnaryType) {
    UnaryType[UnaryType["NEGATION"] = 0] = "NEGATION";
    UnaryType[UnaryType["INCREMENT"] = 1] = "INCREMENT";
    UnaryType[UnaryType["DECREMENT"] = 2] = "DECREMENT";
})(UnaryType = exports.UnaryType || (exports.UnaryType = {}));
class Unary extends expression_1.Expression {
    constructor(type, value, line, column) {
        super(line, column);
        this.type = type;
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        if (this.type !== UnaryType.NEGATION && !(this.value instanceof getValue_1.GetValue)) {
            report_1.output.setOutput(`-->Semántico, mala operación de tipo: ${UnaryType[this.type]} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Mala operación de tipo: ${UnaryType[this.type]}.`, this.line, this.column);
        }
        const value = this.value.run(globalST, localST, method, environment);
        if (value.type == type_1.ValueType.DOUBLE || value.type == type_1.ValueType.INT) {
            switch (this.type) {
                case UnaryType.NEGATION:
                    return { type: value.type, value: (-value.value) };
                case UnaryType.DECREMENT:
                    return { type: value.type, value: (value.value - 1) };
                case UnaryType.INCREMENT:
                    return { type: value.type, value: (value.value + 1) };
            }
        }
        report_1.output.setOutput(`-->Semántico, mala operación de tipo: ${UnaryType[this.type]}, a: ${type_1.ValueType[value.type]} (${this.line}:${this.column}).`);
        throw new error_1.Error("Semántico", `Mala operación de tipo: ${UnaryType[this.type]}, a: ${type_1.ValueType[value.type]}.`, this.line, this.column);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="${this.getOperation()}"];
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
    getOperation() {
        switch (this.type) {
            case UnaryType.DECREMENT:
                return `Decremento --`;
            case UnaryType.INCREMENT:
                return `Incremento ++`;
            case UnaryType.NEGATION:
                return `Negacion Unaria -`;
        }
    }
}
exports.Unary = Unary;
