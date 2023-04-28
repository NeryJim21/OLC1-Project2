"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAST = exports.getTokens = exports.getErrors = exports.testGrammar = void 0;
const compiler_1 = require("./compiler");
const report_1 = require("./reports/report");
const testGrammar = (req, res) => {
    res.json((0, compiler_1.run)(req.body.code));
};
exports.testGrammar = testGrammar;
const getErrors = (req, res) => {
    res.json(report_1.errors.get());
};
exports.getErrors = getErrors;
const getTokens = (req, res) => {
    res.json(report_1.tokens.get());
};
exports.getTokens = getTokens;
const getAST = (req, res) => {
    res.json((0, compiler_1.getDot)());
};
exports.getAST = getAST;
