"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDot = exports.run = void 0;
const methodTable_1 = require("./symbols/methodTable");
const symbolTable_1 = require("./symbols/symbolTable");
const report_1 = require("./reports/report");
const run_1 = require("./run/run");
const dot_1 = require("./run/dot");
const uuid_1 = require("uuid");
const error_1 = require("./reports/error");
const parser = require('./grammar/grammar');
let main = [];
let methods;
let ast;
function run(input) {
    (0, report_1.clearAll)();
    const globalST = new symbolTable_1.SymbolTable([]);
    const localST = new symbolTable_1.SymbolTable([]);
    methods = new methodTable_1.MethodTable([]);
    main = [];
    try {
        ast = parser.parse(input.toString());
        main = (0, run_1.getAST)(ast, globalST, methods);
        (0, run_1.runMain)(main, globalST, localST, methods);
    }
    catch (error) {
        if (error instanceof error_1.Error)
            report_1.errors.add(error);
        console.log(error);
    }
    return report_1.output.getOutput();
}
exports.run = run;
function getDot() {
    const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
    let dot = `node [shape=box];${id} [label="AST"];${(0, dot_1.getDOT)(ast, methods, id)}`;
    if (main.length === 1) {
        const value = main[0].getAST(methods);
        const id_main = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        dot += `${id_main} [label="MAIN"];${id} -> ${id_main} ${id_main} -> ${value.id}; ${value.ast} `;
        return `digraph G { ${dot.replace(/\n/g, "").replace(/\\/g, "")} }`;
    }
    return `digraph G { ${dot.replace(/\n/g, "").replace(/\\/g, "")} }`;
}
exports.getDot = getDot;
