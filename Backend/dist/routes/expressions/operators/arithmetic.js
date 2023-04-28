"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arithmetic = exports.ArithmeticType = void 0;
const type_1 = require("../../types/type");
const expression_1 = require("../../types/expression");
const typesTable_1 = require("../../types/typesTable");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
var ArithmeticType;
(function (ArithmeticType) {
    ArithmeticType[ArithmeticType["SUM"] = 0] = "SUM";
    ArithmeticType[ArithmeticType["SUBTRACCION"] = 1] = "SUBTRACCION";
    ArithmeticType[ArithmeticType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
    ArithmeticType[ArithmeticType["DIVISION"] = 3] = "DIVISION";
    ArithmeticType[ArithmeticType["POWER"] = 4] = "POWER";
    ArithmeticType[ArithmeticType["MODULE"] = 5] = "MODULE";
})(ArithmeticType = exports.ArithmeticType || (exports.ArithmeticType = {}));
class Arithmetic extends expression_1.Expression {
    constructor(type, left, right, line, column) {
        super(line, column);
        this.type = type;
        this.left = left;
        this.right = right;
    }
    run(globalST, localST, method, environment) {
        let leftV = this.left.run(globalST, localST, method, environment);
        let rightV = this.right.run(globalST, localST, method, environment);
        const newType = (0, typesTable_1.getType)(leftV.type, rightV.type, this.type);
        switch (this.type) {
            case ArithmeticType.SUM:
                switch (newType) {
                    case type_1.ValueType.INT:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        return { type: type_1.ValueType.INT, value: (Number(leftV.value) + Number(rightV.value)) };
                    case type_1.ValueType.DOUBLE:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        return { type: type_1.ValueType.DOUBLE, value: (Number(leftV.value) + Number(rightV.value)) };
                    case type_1.ValueType.STRING:
                        return { type: type_1.ValueType.STRING, value: (leftV.value + rightV.value) };
                }
            case ArithmeticType.SUBTRACCION:
                switch (newType) {
                    case type_1.ValueType.INT:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        return { type: type_1.ValueType.INT, value: (Number(leftV.value) - Number(rightV.value)) };
                    case type_1.ValueType.DOUBLE:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        return { type: type_1.ValueType.DOUBLE, value: (Number(leftV.value) - Number(rightV.value)) };
                }
            case ArithmeticType.MULTIPLICATION:
                switch (newType) {
                    case type_1.ValueType.INT:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        return { type: type_1.ValueType.INT, value: (Number(leftV.value) * Number(rightV.value)) };
                    case type_1.ValueType.DOUBLE:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        return { type: type_1.ValueType.DOUBLE, value: (Number(leftV.value) * Number(rightV.value)) };
                }
            case ArithmeticType.DIVISION:
                switch (newType) {
                    case type_1.ValueType.DOUBLE:
                        leftV = this.getAscii(leftV);
                        rightV = this.getAscii(rightV);
                        if (Number(rightV.value) !== 0) {
                            return { type: type_1.ValueType.DOUBLE, value: (Number(leftV.value) / Number(rightV.value)) };
                        }
                        report_1.output.setOutput(`-->Semántico, no se puede realizar división entre 0 (${this.line}:${this.column}).`);
                        throw new error_1.Error("Semántico", `No se puede realizar división entre 0.`, this.line, this.column);
                }
            case ArithmeticType.POWER:
                switch (newType) {
                    case type_1.ValueType.INT:
                        return { type: type_1.ValueType.INT, value: (Math.pow(Number(leftV.value), Number(rightV.value))) };
                    case type_1.ValueType.DOUBLE:
                        return { type: type_1.ValueType.DOUBLE, value: (Math.pow(Number(leftV.value), Number(rightV.value))) };
                }
            case ArithmeticType.MODULE:
                switch (newType) {
                    case type_1.ValueType.DOUBLE:
                        return { type: type_1.ValueType.DOUBLE, value: (Number(leftV.value) % Number(rightV.value)) };
                }
        }
        report_1.output.setOutput(`-->Semántico, mala operación de tipos: ${ArithmeticType[this.type]}, entre: ${type_1.ValueType[leftV.type]} y ${type_1.ValueType[rightV.type]} (${this.line}:${this.column}).`);
        throw new error_1.Error("Semántico", `Mala operación de tipos: ${ArithmeticType[this.type]}, entre: ${type_1.ValueType[leftV.type]} y ${type_1.ValueType[rightV.type]}.`, this.line, this.column);
    }
    getAscii(value) {
        if (value.type === type_1.ValueType.CHAR) {
            return { type: type_1.ValueType.INT, value: value.value.charCodeAt(0) };
        }
        return value;
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const left = this.left.getAST(methods);
        const right = this.right.getAST(methods);
        const ast = `${id} [label="${this.getOperation()}"];
        ${left.ast}
        ${id} -> ${left.id};
        ${right.ast}
        ${id} -> ${right.id};\n`;
        return { id: id, ast: ast };
    }
    getOperation() {
        switch (this.type) {
            case ArithmeticType.SUM:
                return `Suma\\n+`;
            case ArithmeticType.SUBTRACCION:
                return `Resta\\n-`;
            case ArithmeticType.MULTIPLICATION:
                return `Multiplicación\\n*`;
            case ArithmeticType.DIVISION:
                return `División\\n/`;
            case ArithmeticType.MODULE:
                return `Módulo\\n%`;
            case ArithmeticType.POWER:
                return `Potencia\\n^`;
        }
    }
}
exports.Arithmetic = Arithmetic;
