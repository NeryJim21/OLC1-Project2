"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetList = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class GetList extends expression_1.Expression {
    constructor(id, index, line, column) {
        super(line, column);
        this.id = id;
        this.index = index;
    }
    run(globalST, localST, methods, environment) {
        const index = this.index.run(globalST, localST, methods, environment);
        if (index.type !== type_1.ValueType.INT) {
            report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[index.type]} no se puede convertir a INT (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Tipos incompatibles: ${type_1.ValueType[index.type]} no se puede convertir a INT.`, this.line, this.column);
        }
        var symbol = localST.get(this.id);
        if (symbol) {
            this.checkList(symbol.type);
            return this.getValue(symbol, index.value + 1);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.checkList(symbol.type);
                return this.getValue(symbol, index.value + 1);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    checkList(type) {
        if (type !== type_1.ValueType.LIST) {
            report_1.output.setOutput(`-->Semántico, lista requerida, pero no enontrada (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Lista requerida, pero no enontrada.`, this.line, this.column);
        }
    }
    getValue(symbol, index) {
        let list = symbol.value;
        if (index < 1 || index > list.length) {
            report_1.output.setOutput(`-->Semántico, indice fuera de rango en: ${this.id} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Indice fuera de rango en: ${this.id}.`, this.line, this.column);
        }
        return list[index];
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index = this.index.getAST(methods);
        const ast = `${id} [label="Lista"];
        ${id_id} [label="Identificador\\n${this.id}"];
        ${id} -> ${id_id};
        ${index_id} [label="Indice"];
        ${id} -> ${index_id};
        ${index.ast}
        ${index_id} -> ${index.id};\n`;
        return { id: id, ast: ast };
    }
}
exports.GetList = GetList;
