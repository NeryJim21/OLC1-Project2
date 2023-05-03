"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVector = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class GetVector extends expression_1.Expression {
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
            this.checkVector(symbol.type);
            return this.getValue(symbol, index.value);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.checkVector(symbol.type);
                return this.getValue(symbol, index.value);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    checkVector(type) {
        if (type !== type_1.ValueType.VECTOR) {
            report_1.output.setOutput(`-->Semántico, vector requerido, pero no enontrado (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Vector requerido, pero no enontrado.`, this.line, this.column);
        }
    }
    getValue(symbol, index) {
        let vector = symbol.value;
        if (index < 0 || index > vector.length) {
            report_1.output.setOutput(`-->Semántico, indice fuera de rango en: ${this.id}[] (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Indice fuera de rango en: ${this.id}[].`, this.line, this.column);
        }
        return vector[index];
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index = this.index.getAST(methods);
        const ast = `${id} [label="Vector"];
        ${id_id} [label="Identificador ${this.id}[]"];
        ${id} -> ${id_id};
        ${index_id} [label="Indice"];
        ${id} -> ${index_id};
        ${index.ast}
        ${index_id} -> ${index.id}; `;
        return { id: id, ast: ast };
    }
}
exports.GetVector = GetVector;
