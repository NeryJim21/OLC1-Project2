"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    constructor(id, type, type2, environment, line, column) {
        this.id = id;
        this.type = type;
        this.type2 = type2;
        this.environment = environment;
        this.line = line;
        this.column = column;
    }
}
exports.Token = Token;
