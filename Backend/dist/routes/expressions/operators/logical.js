"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logical = exports.LogicalType = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
var LogicalType;
(function (LogicalType) {
    LogicalType[LogicalType["AND"] = 0] = "AND";
    LogicalType[LogicalType["NOT"] = 1] = "NOT";
    LogicalType[LogicalType["OR"] = 2] = "OR";
})(LogicalType = exports.LogicalType || (exports.LogicalType = {}));
class Logical extends expression_1.Expression {
    constructor(type, left, right, line, column) {
        super(line, column);
        this.type = type;
        this.left = left;
        this.right = right;
    }
    run(globalST, localST, method, environment) {
        const leftV = this.left.run(globalST, localST, method, environment);
        const rightV = this.getRightV(globalST, localST, method, environment);
        this.setError(leftV.type, rightV.type);
        switch (this.type) {
            case LogicalType.AND:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value && rightV.value) };
            case LogicalType.NOT:
                return { type: type_1.ValueType.BOOLEAN, value: (!leftV.value) };
            case LogicalType.OR:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value || rightV.value) };
        }
    }
    getRightV(globalST, localST, method, environment) {
        if (this.right !== null && this.type !== LogicalType.NOT) {
            return this.right.run(globalST, localST, method, environment);
        }
        return { type: type_1.ValueType.NULL, value: null };
    }
    setError(leftT, rightT) {
        if (leftT !== type_1.ValueType.BOOLEAN && rightT !== type_1.ValueType.BOOLEAN && this.type !== LogicalType.NOT) {
            report_1.output.setOutput(`-->Semántico, mala operación de tipos: ${LogicalType[this.type]}, entre: ${type_1.ValueType[leftT]} y ${type_1.ValueType[rightT]} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Mala operación de tipos: ${LogicalType[this.type]}, entre: ${type_1.ValueType[leftT]} y ${type_1.ValueType[rightT]}.`, this.line, this.column);
        }
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const left = this.left.getAST(methods);
        let ast = `${id} [label="${this.getOperation()}"];
        ${left.ast}
        ${id} -> ${left.id}; `;
        if (this.right !== null) {
            const right = this.right.getAST(methods);
            ast += `${right.ast}
            ${id} -> ${right.id}; `;
        }
        return { id: id, ast: ast };
    }
    getOperation() {
        switch (this.type) {
            case LogicalType.AND:
                return `And &&`;
            case LogicalType.OR:
                return `Or ||`;
            case LogicalType.NOT:
                return `Not !`;
        }
    }
}
exports.Logical = Logical;
