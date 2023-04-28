"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = void 0;
const symbol_1 = require("./symbol");
class SymbolTable {
    constructor(symbols) {
        this._symbols = [];
        this._symbols = this._symbols.concat(symbols);
    }
    add(type, id, value) {
        this._symbols.push(new symbol_1.Symbol(type, id, value));
    }
    get(id) {
        var symbol = this._symbols.filter((symbol) => symbol.id == id)[0];
        if (symbol)
            return symbol;
        else
            return null;
    }
    upDate(id, value) {
        var symbol = this._symbols.filter((symbol) => symbol.id == id)[0];
        if (symbol)
            symbol.value = value;
    }
    get symbols() {
        return this._symbols;
    }
}
exports.SymbolTable = SymbolTable;
