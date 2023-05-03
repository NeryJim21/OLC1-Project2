"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssingCrement = exports.AssigType = void 0;
const instruction_1 = require("../../types/instruction");
const type_1 = require("../../types/type");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
var AssigType;
(function (AssigType) {
    AssigType[AssigType["DECREMENT"] = 0] = "DECREMENT";
    AssigType[AssigType["INCREMENT"] = 1] = "INCREMENT";
})(AssigType = exports.AssigType || (exports.AssigType = {}));
class AssingCrement extends instruction_1.Instruction {
    constructor(id, type, line, column) {
        super(line, column);
        this.id = id;
        this.type = type;
    }
    run(globalST, localST, method, environment) {
        var symbol = localST.get(this.id);
        if (symbol) {
            this.setDI(symbol, localST);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.setDI(symbol, globalST);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    setDI(symbol, st) {
        if (symbol.type === type_1.ValueType.INT || symbol.type === type_1.ValueType.DOUBLE) {
            if (this.type === AssigType.DECREMENT) {
                st.upDate(this.id, symbol.value - 1);
            }
            else {
                st.upDate(this.id, symbol.value + 1);
            }
            return;
        }
        this.setError(symbol.type);
    }
    setError(type) {
        report_1.output.setOutput(`-->Semántico, mala operación de tipo: ${AssigType[this.type]}, a: ${type_1.ValueType[type]} (${this.line}:${this.column}).`);
        throw new error_1.Error("Semántico", `Mala operación de tipo: ${AssigType[this.type]}, a: ${type_1.ValueType[type]}.`, this.line, this.column);
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux1 = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux2 = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.getType();
        const ast = `${id} [label="${value.type}"];
        ${aux1} [label="Identificador ${this.id}"];
        ${id} -> ${aux1};
        ${aux2} [label="${value.sub}"];
        ${id} -> ${aux2}; `;
        return { id: id, ast: ast };
    }
    getType() {
        switch (this.type) {
            case AssigType.DECREMENT:
                return { type: `DEC`, sub: `Decremento --` };
            case AssigType.INCREMENT:
                return { type: `INC`, sub: `Incremento ++` };
        }
    }
}
exports.AssingCrement = AssingCrement;
