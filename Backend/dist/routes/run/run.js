"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMain = exports.getAST = void 0;
const main_1 = require("../instructions/functions/main");
const instruction_1 = require("../types/instruction");
const report_1 = require("../reports/report");
const error_1 = require("../reports/error");
function getAST(ast, globalST, methods) {
    const main = [];
    for (const instruction of ast) {
        try {
            if (instruction instanceof instruction_1.Instruction)
                instruction.run(globalST, globalST, methods, "-");
            else if (instruction instanceof main_1.Main)
                instruction.run(main);
        }
        catch (error) {
            if (error instanceof error_1.Error)
                report_1.errors.add(error);
        }
    }
    return main;
}
exports.getAST = getAST;
function runMain(main, globalST, localST, methods) {
    if (main.length === 1) {
        main[0].run(globalST, localST, methods, main[0].id);
    }
    else if (main.length > 1) {
        report_1.output.setOutput(`-->Semántico, solo puede existir un metodo main (${main[1].line}:${main[1].column}).`);
        throw new error_1.Error(`Semántico`, `Solo puede existir un metodo main`, main[1].line, main[1].column);
    }
    else if (main.length < 1) {
        report_1.output.setOutput(`-->Semántico, debe de existir un metodo main.`);
        throw new error_1.Error(`Semántico`, `Debe de existir un metodo main`, 0, 0);
    }
}
exports.runMain = runMain;
