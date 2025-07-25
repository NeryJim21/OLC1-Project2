"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
const instruction_1 = require("../../types/instruction");
const type_1 = require("../../types/type");
const uuid_1 = require("uuid");
class Continue extends instruction_1.Instruction {
    constructor(line, column) {
        super(line, column);
    }
    run() {
        return { type: type_1.ControlType.CONTINUE, line: this.line, column: this.column };
    }
    getAST() {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const ast = `${id} [label="Continue"]; `;
        return { id: id, ast: ast };
    }
}
exports.Continue = Continue;
