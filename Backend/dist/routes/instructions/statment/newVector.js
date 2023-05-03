"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewVector = void 0;
const toChar_1 = require("../../expressions/nativeFunc/toChar");
const type_1 = require("../../types/type");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const expression_1 = require("../../types/expression");
const checks_1 = require("../checks");
const error_1 = require("../../reports/error");
const token_1 = require("../../reports/token");
const uuid_1 = require("uuid");
class NewVector extends instruction_1.Instruction {
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
        let vector = [];
        if (this.value instanceof toChar_1.ToChar) {
            const aux = this.value.run(globalST, localST, methods, environment);
            this.toChar(vector, aux.value);
        }
        else if (this.value instanceof expression_1.Expression) {
            const size = this.value.run(globalST, localST, methods, environment);
            this.declarationDefault(vector, size);
        }
        else {
            this.declaration2(globalST, localST, methods, environment, vector, this.value);
        }
        localST.add(type_1.ValueType.VECTOR, this.id, vector);
        report_1.tokens.add(new token_1.Token(this.id, "Vector", type_1.ValueType[this.type], environment, this.line, this.column));
    }
    toChar(vector, aux) {
        if (this.type !== type_1.ValueType.CHAR) {
            this.setError("CHAR", type_1.ValueType[this.type]);
        }
        for (var i in aux) {
            vector.push({ type: type_1.ValueType.CHAR, value: aux[i] });
        }
    }
    declarationDefault(vector, size) {
        if (this.type !== this.type2 && this.type2 !== null) {
            this.setError(type_1.ValueType[this.type2], type_1.ValueType[this.type]);
        }
        if (size.type !== type_1.ValueType.INT) {
            this.setError(type_1.ValueType[this.type], "INT");
        }
        for (var i = 0; i < size.value; i++) {
            vector.push((0, checks_1.defaultValue)(this.type));
        }
    }
    declaration2(globalST, localST, methods, environment, vector, expression) {
        for (var i in expression) {
            const aux = expression[i].run(globalST, localST, methods, environment);
            const value = (0, checks_1.checkType)(this.type, aux, this.line, this.column);
            vector.push(value);
        }
    }
    setError(type1, type2) {
        report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type1}[] no puede convertirse a ${type2}[] (${this.line}:${this.column}).`);
        throw new error_1.Error("Semántico", `Tipos incompatibles: ${type1}[] no puede convertirse a ${type2}[].`, this.line, this.column);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.getValue(methods);
        const ast = `${id} [label="Declaracion nVector"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux};
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
    getValue(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Valores"]; `;
        if (this.value instanceof toChar_1.ToChar) {
            const value = this.value.getAST(methods);
            ast += `${value.ast}
            ${id} -> ${value.id}; `;
            return { id: id, ast: ast };
        }
        else if (this.value instanceof expression_1.Expression) {
            return { id: id, ast: ast };
        }
        else {
            for (var i in this.value) {
                const aux = this.value[i].getAST(methods);
                ast += `${aux.ast}
                ${id} -> ${aux.id}; `;
            }
            return { id: id, ast: ast };
        }
    }
}
exports.NewVector = NewVector;
