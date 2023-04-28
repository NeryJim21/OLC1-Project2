"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushList = void 0;
const type_1 = require("../../types/type");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class PushList extends instruction_1.Instruction {
    constructor(id, value, line, column) {
        super(line, column);
        this.id = id;
        this.value = value;
    }
    run(globalST, localST, methods, environment) {
        const value = this.value.run(globalST, localST, methods, environment);
        let symbol = localST.get(this.id);
        if (symbol) {
            this.checkPush(localST, symbol, value);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.checkPush(globalST, symbol, value);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    checkPush(st, symbol, value) {
        let list = symbol.value;
        if (value.type !== list[0].type) {
            report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[value.type]} no se puede convertir a ${type_1.ValueType[list[0].type]} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Tipos incompatibles: ${type_1.ValueType[value.type]} no se puede convertir a ${type_1.ValueType[list[0].type]}.`, this.line, this.column);
        }
        list.push(value);
        st.upDate(this.id, list);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="Añadir a\\nLista"];
        ${id_id} [label="Identificador\\n${this.id}"];
        ${id} -> ${id_id};
        ${value.ast}
        ${id} -> ${value.id};\n`;
        return { id: id, ast: ast };
    }
}
exports.PushList = PushList;
