"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternary = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class Ternary extends expression_1.Expression {
    constructor(condition, trueV, falseV, line, column) {
        super(line, column);
        this.condition = condition;
        this.trueV = trueV;
        this.falseV = falseV;
    }
    run(globalST, localST, method, environment) {
        const condition = this.condition.run(globalST, localST, method, environment);
        if (condition.type !== type_1.ValueType.BOOLEAN) {
            report_1.output.setOutput(`-->Semántico, condición de Ternario no es de tipo BOOLEAN (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Condición de Ternario no es de tipo BOOLEAN.`, this.line, this.column);
        }
        if (condition.value) {
            return this.trueV.run(globalST, localST, method, environment);
        }
        else {
            return this.falseV.run(globalST, localST, method, environment);
        }
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const vtrue = this.getTrue(methods);
        const vfalse = this.getFalse(methods);
        const condition = this.getCondition(methods);
        const ast = `${id} [label="Ternario"];
        ${condition.ast}
        ${id} -> ${condition.id};
        ${vtrue.ast}
        ${id} -> ${vtrue.id};
        ${vfalse.ast}
        ${id} -> ${vfalse.id};\n`;
        return { id: id, ast: ast };
    }
    getCondition(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const condition = this.condition.getAST(methods);
        const ast = `${id} [lable="Condicion"];
        ${condition.ast}
        ${id} -> ${condition.id};\n`;
        return { id: id, ast: ast };
    }
    getTrue(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const vtrue = this.trueV.getAST(methods);
        const ast = `${id} [label="Valor\\nVerdadero"];
        ${vtrue.ast}
        ${id} -> ${vtrue.id};\n`;
        return { id: id, ast: ast };
    }
    getFalse(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const vfalse = this.falseV.getAST(methods);
        const ast = `${id} [label="Valor\\nFalso"];
        ${vfalse.ast}
        ${id} -> ${vfalse.id};\n`;
        return { id: id, ast: ast };
    }
}
exports.Ternary = Ternary;
