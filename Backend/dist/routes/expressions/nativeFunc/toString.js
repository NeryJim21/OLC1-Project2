"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToString = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const uuid_1 = require("uuid");
class ToString extends expression_1.Expression {
    constructor(value, line, column) {
        super(line, column);
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        const value = this.value.run(globalST, localST, method, environment);
        return { type: type_1.ValueType.STRING, value: (value.value).toString() };
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const ast = `${id} [label="ToString"];
        ${value.ast}
        ${id} -> ${value.id};\n`;
        return { id: id, ast: ast };
    }
}
exports.ToString = ToString;
