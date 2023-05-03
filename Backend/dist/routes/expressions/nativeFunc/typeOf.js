"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOf = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const uuid_1 = require("uuid");
class TypeOf extends expression_1.Expression {
    constructor(value, line, column) {
        super(line, column);
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        const value = this.value.run(globalST, localST, method, environment);
        return { type: type_1.ValueType.STRING, value: type_1.ValueType[value.type] };
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="TypeOf"];
        ${value.ast}
        ${id} -> ${value.id}; `;
        return { id: id, ast: ast };
    }
}
exports.TypeOf = TypeOf;
