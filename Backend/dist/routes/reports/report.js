"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAll = exports.errors = exports.tokens = exports.output = void 0;
const tokenTable_1 = require("./tokenTable");
const errorTable_1 = require("./errorTable");
const output_1 = require("./output");
exports.output = new output_1.Output();
exports.tokens = new tokenTable_1.TokenTable();
exports.errors = new errorTable_1.ErrorTable();
function clearAll() {
    exports.output.clear();
    exports.tokens.clear();
    exports.errors.clear();
}
exports.clearAll = clearAll;
