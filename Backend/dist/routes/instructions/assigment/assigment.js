"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assigment = void 0;
const checks_1 = require("../checks");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class Assigment extends instruction_1.Instruction {
    constructor(id, value, line, column) {
        super(line, column);
        this.id = id;
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        const value = this.value.run(globalST, localST, method, environment);
        var symbol = localST.get(this.id);
        if (symbol) {
            this.updateValue(localST, symbol, value);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.updateValue(globalST, symbol, value);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    updateValue(st, symbol, value) {
        (0, checks_1.checkEstructure)(symbol, value.type, this.line, this.column);
        const aux = (0, checks_1.checkType)(symbol.type, value, this.line, this.column);
        st.upDate(this.id, aux.value);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="Asignacion Variable"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux};
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
}
exports.Assigment = Assigment;
