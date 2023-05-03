"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relational = exports.RelationalType = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
var RelationalType;
(function (RelationalType) {
    RelationalType[RelationalType["GEQUALS"] = 0] = "GEQUALS";
    RelationalType[RelationalType["LEQUALS"] = 1] = "LEQUALS";
    RelationalType[RelationalType["NEQUALS"] = 2] = "NEQUALS";
    RelationalType[RelationalType["GREATER"] = 3] = "GREATER";
    RelationalType[RelationalType["EQUALS"] = 4] = "EQUALS";
    RelationalType[RelationalType["LESS"] = 5] = "LESS";
})(RelationalType = exports.RelationalType || (exports.RelationalType = {}));
class Relational extends expression_1.Expression {
    constructor(type, left, right, line, column) {
        super(line, column);
        this.type = type;
        this.left = left;
        this.right = right;
    }
    run(globalST, localST, method, environment) {
        const leftV = this.left.run(globalST, localST, method, environment);
        const rightV = this.right.run(globalST, localST, method, environment);
        this.setError(leftV.type, rightV.type);
        switch (this.type) {
            case RelationalType.GEQUALS:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value >= rightV.value) };
            case RelationalType.LEQUALS:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value <= rightV.value) };
            case RelationalType.NEQUALS:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value != rightV.value) };
            case RelationalType.EQUALS:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value === rightV.value) };
            case RelationalType.GREATER:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value > rightV.value) };
            case RelationalType.LESS:
                return { type: type_1.ValueType.BOOLEAN, value: (leftV.value < rightV.value) };
        }
    }
    setError(leftT, rightT) {
        if (this.type !== RelationalType.EQUALS && this.type !== RelationalType.NEQUALS &&
            (leftT === type_1.ValueType.STRING || leftT === type_1.ValueType.BOOLEAN ||
                rightT === type_1.ValueType.STRING || rightT === type_1.ValueType.BOOLEAN)) {
            report_1.output.setOutput(`-->Semántico, mala operación de tipos: ${RelationalType[this.type]}, entre: ${type_1.ValueType[leftT]} y ${type_1.ValueType[rightT]} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Mala operación de tipos: ${RelationalType[this.type]}, entre: ${type_1.ValueType[leftT]} y ${type_1.ValueType[rightT]}.`, this.line, this.column);
        }
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const left = this.left.getAST(methods);
        const right = this.right.getAST(methods);
        const ast = `${id} [label="${this.getOperation()}"];
        ${left.ast}
        ${id} -> ${left.id};
        ${right.ast}
        ${id} -> ${right.id}; `;
        return { id: id, ast: ast };
    }
    getOperation() {
        switch (this.type) {
            case RelationalType.EQUALS:
                return `Igual Igual ==`;
            case RelationalType.NEQUALS:
                return `No Igual !=`;
            case RelationalType.GEQUALS:
                return `Mayor Igual >=`;
            case RelationalType.LEQUALS:
                return `Menor Igual <=`;
            case RelationalType.GREATER:
                return `Mayor >`;
            case RelationalType.LESS:
                return `Menor <`;
        }
    }
}
exports.Relational = Relational;
