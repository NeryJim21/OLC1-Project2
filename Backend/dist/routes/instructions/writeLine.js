"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteLine = void 0;
const instruction_1 = require("../types/instruction");
const expression_1 = require("../types/expression");
const report_1 = require("../reports/report");
const uuid_1 = require("uuid");
class WriteLine extends instruction_1.Instruction {
    constructor(expression, line, column) {
        super(line, column);
        this.expression = expression;
    }
    run(globalST, localST, method, environment) {
        if (this.expression instanceof expression_1.Expression) {
            const value = this.expression.run(globalST, localST, method, environment);
            report_1.output.setOutput(value.value);
        }
        else {
            report_1.output.setOutput("");
        }
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.getValue(methods);
        const ast = `${id} [label="WriteLine"];
        ${value.ast}
        ${id} -> ${value.id};\n`;
        return { id: id, ast: ast };
    }
    getValue(methods) {
        if (this.expression) {
            return this.expression.getAST(methods);
        }
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const ast = `${id} [label=""];`;
        return { id: id, ast: ast };
    }
}
exports.WriteLine = WriteLine;
