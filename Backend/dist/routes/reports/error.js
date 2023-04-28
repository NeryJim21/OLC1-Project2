"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor(type, description, line, column) {
        this.type = type;
        this.description = description;
        this.line = line;
        this.column = column;
    }
}
exports.Error = Error;
