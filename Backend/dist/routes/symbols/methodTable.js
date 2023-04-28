"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodTable = void 0;
const method_1 = require("./method");
class MethodTable {
    constructor(methods) {
        this._methods = [];
        this._methods = this._methods.concat(methods);
    }
    add(type, id, parameters, body) {
        this._methods.push(new method_1.Method(type, id, parameters, body));
    }
    get(id) {
        var method = this._methods.filter((method) => method.id == id)[0];
        if (method) {
            return method;
        }
        return null;
    }
    clearBody(id) {
        var method = this._methods.filter((method) => method.id == id)[0];
        if (method)
            method.body = [];
    }
    get methods() {
        return this._methods;
    }
}
exports.MethodTable = MethodTable;
