"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewList = void 0;
const toChar_1 = require("../../expressions/nativeFunc/toChar");
const type_1 = require("../../types/type");
const report_1 = require("../../reports/report");
const instruction_1 = require("../../types/instruction");
const token_1 = require("../../reports/token");
const error_1 = require("../../reports/error");
const checks_1 = require("../checks");
const uuid_1 = require("uuid");
class NewList extends instruction_1.Instruction {
    constructor(id, type, type2, value, line, column) {
        super(line, column);
        this.id = id;
        this.type = type;
        this.type2 = type2;
        this.value = value;
    }
    run(globalST, localST, methods, environment) {
        var aux = localST.get(this.id);
        if (aux) {
            report_1.output.setOutput(`-->Semántico, la variable ya se encuentra definida: ${this.id} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `La variable ya se encuentra definida: ${this.id}.`, this.line, this.column);
        }
        let list = [];
        if (this.value instanceof toChar_1.ToChar) {
            const aux = this.value.run(globalST, localST, methods, environment);
            this.toChar(list, aux.value);
        }
        else {
            this.declarationDefault(list);
        }
        localST.add(type_1.ValueType.LIST, this.id, list);
        report_1.tokens.add(new token_1.Token(this.id, "Lista", type_1.ValueType[this.type], environment, this.line, this.column));
    }
    toChar(list, aux) {
        if (this.type !== type_1.ValueType.CHAR) {
            this.setError("CHAR", type_1.ValueType[this.type]);
        }
        list.push((0, checks_1.defaultValue)(this.type));
        for (var i in aux) {
            list.push({ type: type_1.ValueType.CHAR, value: aux[i] });
        }
    }
    declarationDefault(list) {
        if (this.type !== this.type2 && this.type2 !== null) {
            this.setError(type_1.ValueType[this.type2], type_1.ValueType[this.type]);
        }
        list.push((0, checks_1.defaultValue)(this.type));
    }
    setError(type1, type2) {
        report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type1} no puede convertirse a ${type2} (${this.line}:${this.column}).`);
        throw new error_1.Error("Semántico", `Tipos incompatibles: ${type1} no puede convertirse a ${type2}.`, this.line, this.column);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const ast = `${id} [label="Declaracion Lista"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux}; `;
        return { id: id, ast: ast };
    }
}
exports.NewList = NewList;
