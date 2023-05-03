"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = void 0;
const instruction_1 = require("../../types/instruction");
const type_1 = require("../../types/type");
const report_1 = require("../../reports/report");
const token_1 = require("../../reports/token");
const uuid_1 = require("uuid");
class Function extends instruction_1.Instruction {
    constructor(type, id, parameters, body, line, column) {
        super(line, column);
        this.type = type;
        this.id = id;
        this.parameters = parameters;
        this.body = body;
    }
    run(globalST, localST, method, environment) {
        method.add(this.type, this.id, this.parameters, this.body);
        report_1.tokens.add(new token_1.Token(this.id, "Método", type_1.ValueType[this.type], environment, this.line, this.column));
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const parameters = this.getParameter();
        let ast = `${id} [label="Declaracion Funcion ${this.getType()}"];
        ${id_id} [label="Identificador ${this.id}"];
        ${id} -> ${id_id}; `;
        if (this.parameters.length !== 0) {
            const parameters = this.getParameter();
            ast += `${parameters.ast}
            ${id} -> ${parameters.id}; `;
        }
        return { id: id, ast: ast };
    }
    getParameter() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Parametros"]; `;
        for (var i in this.parameters) {
            const par = this.parameters[i].getAST();
            ast += `${par.ast}
            ${id} -> ${par.id}; `;
        }
        return { id: id, ast: ast };
    }
    getType() {
        switch (this.type) {
            case type_1.ValueType.VOID:
                return `Void`;
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
exports.Function = Function;
