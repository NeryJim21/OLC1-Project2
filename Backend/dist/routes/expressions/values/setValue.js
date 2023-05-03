"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetValue = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const uuid_1 = require("uuid");
class SetValue extends expression_1.Expression {
    constructor(type, value, line, column) {
        super(line, column);
        this.type = type;
        this.value = value;
    }
    run(globalST, localST, method, environment) {
        if (this.type === type_1.ValueType.STRING || this.type === type_1.ValueType.CHAR) {
            const value = this.value.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\'/g, "\'").replace(/\\\\/g, "\\").replace(/\\"/g, "\"");
            return { type: this.type, value: value };
        }
        return { type: this.type, value: this.value };
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let value = this.value;
        if (this.type === type_1.ValueType.STRING || this.type === type_1.ValueType.CHAR) {
            value = this.value.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\'/g, "\'").replace(/\\\\/g, "\\").replace(/\\"/g, "\"");
        }
        const ast = `${id} [label="${this.getType()} ${value}"]; `;
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
exports.SetValue = SetValue;
