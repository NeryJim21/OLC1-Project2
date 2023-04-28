"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDOT = void 0;
const instruction_1 = require("../types/instruction");
function getDOT(ast, methods, id) {
    let dot = ``;
    for (const instruction of ast) {
        if (instruction instanceof instruction_1.Instruction) {
            const aux = instruction.getAST(methods);
            dot += `${aux.ast}
            ${id} -> ${aux.id};\n`;
        }
    }
    return dot;
}
exports.getDOT = getDOT;
