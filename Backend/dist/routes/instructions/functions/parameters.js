"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameters = void 0;
const type_1 = require("../../types/type");
const uuid_1 = require("uuid");
class Parameters {
    constructor(type, type2, id) {
        this.type = type;
        this.type2 = type2;
        this.id = id;
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_type = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const ast = `${id} [label="Identificador\\n${this.id}"];
        ${id_type} [label="${this.getType(this.type)}"];
        ${id} -> ${id_type};\n`;
        return { id: id, ast: ast };
    }
    getType(type) {
        let type2;
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
            case type_1.ValueType.LIST:
                if (this.type2)
                    type2 = this.getType(this.type2);
                return `Lista\\n${type2}`;
            case type_1.ValueType.VECTOR:
                if (this.type2)
                    type2 = this.getType(this.type2);
                return `Vector\\n${type2}`;
            default:
                return ``;
        }
    }
}
exports.Parameters = Parameters;
