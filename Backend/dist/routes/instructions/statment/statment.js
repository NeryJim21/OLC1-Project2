"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statment = void 0;
const report_1 = require("../../reports/report");
const instruction_1 = require("../../types/instruction");
const checks_1 = require("../checks");
const type_1 = require("../../types/type");
const token_1 = require("../../reports/token");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class Statment extends instruction_1.Instruction {
    constructor(type, id, value, line, column) {
        super(line, column);
        this.type = type;
        this.id = id;
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        this.setStatment(this.id, globalST, localST, method, environment);
    }
    setStatment(id, globalST, localST, method, environment) {
        const aux = localST.get(id);
        if (aux) {
            report_1.output.setOutput(`-->Semántico, la variable ya se encuentra definida: ${id} (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `La variable ya se encuentra definida: ${id}.`, this.line, this.column);
        }
        var value;
        if (this.value) {
            value = this.value.run(globalST, localST, method, environment);
        }
        else {
            value = (0, checks_1.defaultValue)(this.type);
        }
        value = (0, checks_1.checkType)(this.type, value, this.line, this.column);
        localST.add(this.type, id, value.value);
        report_1.tokens.add(new token_1.Token(id, "Variable", type_1.ValueType[value.type], environment, this.line, this.column));
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.getValue(methods);
        const ast = `${id} [label="Declaracion Variable"];
        ${aux} [label="Identificador ${this.id}"];
        ${id} -> ${aux};
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
    getValue(methods) {
        if (this.value) {
            return this.value.getAST(methods);
        }
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = (0, checks_1.defaultValue)(this.type);
        const ast = `${id} [label="${this.getType(value.type)} ${value.value}"]; `;
        return { id: id, ast: ast };
    }
    getType(type) {
        switch (type) {
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
            default:
                return ``;
        }
    }
}
exports.Statment = Statment;
