"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTable = void 0;
class ErrorTable {
    constructor() {
        this._errors = [];
    }
    clear() {
        this._errors = [];
    }
    add(error) {
        this._errors.push(error);
    }
    get() {
        return this._errors;
    }
}
exports.ErrorTable = ErrorTable;
