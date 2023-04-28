"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetValue = void 0;
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class GetValue extends expression_1.Expression {
    constructor(id, line, column) {
        super(line, column);
        this.id = id;
    }
    run(globalST, localST, method, environment) {
        const value = localST.get(this.id);
        if (value === null) {
            const value = globalST.get(this.id);
            if (value === null) {
                report_1.output.setOutput(`-->Semántico, no se puedo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se puedo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
            return { type: value.type, value: value.value };
        }
        return { type: value.type, value: value.value };
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const ast = `${id} [label="Identificador\\n${this.id}"];\n`;
        return { id: id, ast: ast };
    }
}
exports.GetValue = GetValue;
