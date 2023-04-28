"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const instruction_1 = require("../../types/instruction");
const type_1 = require("../../types/type");
const uuid_1 = require("uuid");
class Return extends instruction_1.Instruction {
    constructor(value, line, column) {
        super(line, column);
        this.value = value;
    }
    run(globalST, localST, methods, environment) {
        if (this.value === null) {
            return { type: type_1.ControlType.RETURN, value: null, line: this.line, column: this.column };
        }
        const value = this.value.run(globalST, localST, methods, environment);
        return { type: type_1.ControlType.RETURN, value: value, line: this.line, column: this.column };
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Return"];\n`;
        if (this.value) {
            const value = this.value.getAST(methods);
            ast += `${value.ast}
            ${id} -> ${value.id};\n`;
        }
        return { id: id, ast: ast };
    }
}
exports.Return = Return;
