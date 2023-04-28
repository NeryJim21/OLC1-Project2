"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTable = void 0;
class TokenTable {
    constructor() {
        this._tokens = [];
    }
    clear() {
        this._tokens = [];
    }
    add(token) {
        this._tokens.push(token);
    }
    get() {
        return this._tokens;
    }
}
exports.TokenTable = TokenTable;
