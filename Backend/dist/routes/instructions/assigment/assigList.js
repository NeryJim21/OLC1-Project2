"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssigList = void 0;
const type_1 = require("../../types/type");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const checks_1 = require("../checks");
const uuid_1 = require("uuid");
class AssigList extends instruction_1.Instruction {
    constructor(id, index, value, line, column) {
        super(line, column);
        this.id = id;
        this.index = index;
        this.value = value;
    }
    run(globalST, localST, methods, environment) {
        let index = this.index.run(globalST, localST, methods, environment);
        if (index.type !== type_1.ValueType.INT) {
            report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[index.type]} no se puede convertir a INT (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Tipos incompatibles: ${type_1.ValueType[index.type]} no se puede convertir a INT.`, this.line, this.column);
        }
        const value = this.value.run(globalST, localST, methods, environment);
        let symbol = localST.get(this.id);
        if (symbol) {
            this.checkUpdate(localST, symbol, value, index.value + 1);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.checkUpdate(globalST, symbol, value, index.value + 1);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    checkUpdate(st, symbol, value, index) {
        let list = symbol.value;
        if (symbol.type !== type_1.ValueType.LIST) {
            report_1.output.setOutput(`-->Semántico, lista requerida, pero no enontrada (${this.line}:${this.column}).`);
            throw new error_1.Error(`Semántico`, `Lista requerida, pero no enontrada.`, this.line, this.column);
        }
        if (index < 1 || index > list.length) {
            report_1.output.setOutput(`-->Semántico, indice fuera de rango en: ${this.id}[] (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Indice fuera de rango en: ${this.id}[].`, this.line, this.column);
        }
        const aux = (0, checks_1.checkType)(list[0].type, value, this.line, this.column);
        list[index] = aux;
        st.upDate(this.id, list);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index = this.getIndex(methods);
        const value = this.value.getAST(methods);
        const ast = `${id} [label="Asignacion Lista"];
        ${id_id} [label="Identificador ${this.id}"];
        ${id} -> ${id_id};
        ${index.ast}
        ${id} -> ${index.id};
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
    getIndex(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index = this.index.getAST(methods);
        const ast = `${id} [label="Indice"];
        ${index.ast}
        ${id} -> ${index.id}`;
        return { id: id, ast: ast };
    }
}
exports.AssigList = AssigList;
