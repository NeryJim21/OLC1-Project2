"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlType = exports.ValueType = void 0;
var ValueType;
(function (ValueType) {
    ValueType[ValueType["INT"] = 0] = "INT";
    ValueType[ValueType["DOUBLE"] = 1] = "DOUBLE";
    ValueType[ValueType["BOOLEAN"] = 2] = "BOOLEAN";
    ValueType[ValueType["CHAR"] = 3] = "CHAR";
    ValueType[ValueType["STRING"] = 4] = "STRING";
    ValueType[ValueType["NULL"] = 5] = "NULL";
    ValueType[ValueType["VOID"] = 6] = "VOID";
    ValueType[ValueType["VECTOR"] = 7] = "VECTOR";
    ValueType[ValueType["LIST"] = 8] = "LIST";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
var ControlType;
(function (ControlType) {
    ControlType[ControlType["BREAK"] = 0] = "BREAK";
    ControlType[ControlType["RETURN"] = 1] = "RETURN";
    ControlType[ControlType["CONTINUE"] = 2] = "CONTINUE";
})(ControlType = exports.ControlType || (exports.ControlType = {}));
