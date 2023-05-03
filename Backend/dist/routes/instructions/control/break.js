"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const instruction_1 = require("../../types/instruction");
const type_1 = require("../../types/type");
const uuid_1 = require("uuid");
class Break extends instruction_1.Instruction {
    constructor(line, column) {
        super(line, column);
    }
    run() {
        return { type: type_1.ControlType.BREAK, line: this.line, column: this.column };
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const ast = `${id} [label="Break"]; `;
        return { id: id, ast: ast };
    }
}
exports.Break = Break;
