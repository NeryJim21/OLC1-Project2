"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Casting = void 0;
const type_1 = require("../types/type");
const expression_1 = require("../types/expression");
const report_1 = require("../reports/report");
const error_1 = require("../reports/error");
const uuid_1 = require("uuid");
class Casting extends expression_1.Expression {
    constructor(type, value, line, column) {
        super(line, column);
        this.type = type;
        this.value = value;
    }
    run(globlaST, localST, methods, environment) {
        const value = this.value.run(globlaST, localST, methods, environment);
        switch (this.type) {
            case type_1.ValueType.INT:
                switch (value.type) {
                    case type_1.ValueType.INT:
                        return { type: this.type, value: value.value };
                    case type_1.ValueType.DOUBLE:
                        return { type: this.type, value: Math.trunc(value.value) };
                    case type_1.ValueType.CHAR:
                        return { type: this.type, value: (value.value).charCodeAt(0) };
                }
            case type_1.ValueType.DOUBLE:
                switch (value.type) {
                    case type_1.ValueType.INT:
                        return { type: this.type, value: value.value };
                    case type_1.ValueType.DOUBLE:
                        return { type: this.type, value: value.value };
                    case type_1.ValueType.CHAR:
                        return { type: this.type, value: (value.value).charCodeAt(0) };
                }
            case type_1.ValueType.CHAR:
                switch (value.type) {
                    case type_1.ValueType.INT:
                        return { type: this.type, value: String.fromCharCode(value.value) };
                    case type_1.ValueType.CHAR:
                        return { type: this.type, value: value.value };
                }
            case type_1.ValueType.BOOLEAN:
                switch (value.type) {
                    case type_1.ValueType.BOOLEAN:
                        return { type: this.type, value: value.value };
                }
            case type_1.ValueType.STRING:
                switch (value.type) {
                    case type_1.ValueType.STRING:
                        return { type: this.type, value: value.value };
                }
        }
        report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[value.type]} no se puede convertir a ${type_1.ValueType[this.type]} (${this.line}:${this.column}).`);
        throw new error_1.Error("Semántico", `Tipos incompatibles: ${type_1.ValueType[value.type]} no se puede convertir a ${type_1.ValueType[this.type]}.`, this.line, this.column);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="Casteo ${this.getType()}"];
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
    getType() {
        switch (this.type) {
            case type_1.ValueType.STRING:
                return `String`;
            case type_1.ValueType.CHAR:
                return `Char`;
            case type_1.ValueType.INT:
                return `Int`;
            case type_1.ValueType.DOUBLE:
                return `Double`;
            case type_1.ValueType.BOOLEAN:
                return `Boolean`;
        }
        return ``;
    }
}
exports.Casting = Casting;
