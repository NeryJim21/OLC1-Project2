"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallMethod = void 0;
const type_1 = require("../../types/type");
const methodTable_1 = require("../../symbols/methodTable");
const symbolTable_1 = require("../../symbols/symbolTable");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class CallMethod extends instruction_1.Instruction {
    constructor(id, atributes, line, column) {
        super(line, column);
        this.id = id;
        this.atributes = atributes;
    }
    run(globalST, localST, methods, environment) {
        const method = methods.get(this.id);
        if (method) {
            if (method.type === type_1.ValueType.VOID) {
                if (method.parameters.length === this.atributes.length) {
                    var localST2 = this.getLocalST(method, globalST, localST, methods, environment);
                    const control = this.runMethod(method.body, globalST, localST2, methods, this.id);
                    // Manejo de retornos
                    if (control != null && control != undefined) {
                        if (control.type == type_1.ControlType.RETURN) {
                            if (control.vulue === null)
                                return;
                            this.setError(`No se puede retornar tipo ${type_1.ValueType[control.value.type]} en método VOID.`, control.line, control.column);
                        }
                    }
                    return;
                }
                else if (method.parameters.length >= this.atributes.length) {
                    this.setError(`Muy pocos atributos, esperados: ${method.parameters.length}, obtenidos:${this.atributes.length}.`, this.line, this.column);
                }
                else {
                    this.setError(`Muchos atributos, esperados: ${method.parameters.length}, obtenidos:${this.atributes.length}.`, this.line, this.column);
                }
            }
            this.setError(`Método VOID no asignado de forma correcta.`, this.line, this.column);
        }
        this.setError(`No existe el método: ${this.id}.`, this.line, this.column);
    }
    getLocalST(method, globalST, localST, methods, environment) {
        var localST2 = new symbolTable_1.SymbolTable([]);
        for (var i in this.atributes) {
            var value = this.atributes[i].run(globalST, localST, methods, environment);
            if (value.type === method.parameters[i].type) {
                if (value.type === type_1.ValueType.LIST && value.value[0].type !== method.parameters[i].type2) {
                    this.setError(`Tipo de atributo: ${type_1.ValueType[value.value[0].type]}, no coincide con: ${type_1.ValueType[method.parameters[i].type2]}.`, this.line, this.column);
                }
                else if (value.type === type_1.ValueType.VECTOR && value.value[0].type !== method.parameters[i].type2) {
                    this.setError(`Tipo de atributo: ${type_1.ValueType[value.value[0].type]}[], no coincide con: ${type_1.ValueType[method.parameters[i].type2]}[].`, this.line, this.column);
                }
                localST2.add(value.type, method.parameters[i].id, value.value);
            }
            else {
                this.setError(`Tipo de atributo: ${type_1.ValueType[value.type]}, no coincide con: ${type_1.ValueType[method.parameters[i].type]}.`, this.line, this.column);
            }
        }
        return localST2;
    }
    runMethod(body, globalST, localST, methods, environment) {
        for (var i in body) {
            const control = body[i].run(globalST, localST, methods, environment);
            if (control !== null && control !== undefined) {
                return control;
            }
        }
        return null;
    }
    setError(msg, line, column) {
        report_1.output.setOutput(`-->Semántico, ${msg} (${line}:${column}).`);
        throw new error_1.Error(`Semántico`, msg, line, column);
    }
    getAST(methods) {
        const temp = new methodTable_1.MethodTable(methods.methods);
        const method = methods.get(this.id);
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Llamada Metodo ${this.id}"]; `;
        if (this.atributes.length !== 0) {
            const aux = this.getAtributes(methods);
            ast += `${aux.ast}
            ${id} -> ${aux.id}; `;
        }
        if (method && method.body.length !== 0) {
            const body = method.body;
            temp.clearBody(this.id);
            const id_body = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
            ast += `${id_body} [label="Cuerpo"] ;
            ${id} -> ${id_body}; `;
            for (var i in body) {
                const aux = body[i].getAST(temp);
                ast += `${aux.ast}
                ${id_body} -> ${aux.id}; `;
            }
        }
        return { id: id, ast: ast };
    }
    getAtributes(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Atributos"]; `;
        for (var i in this.atributes) {
            const aux = this.atributes[i].getAST(methods);
            ast += `${aux.ast}
            ${id} -> ${aux.id}; `;
        }
        return { id: id, ast: ast };
    }
}
exports.CallMethod = CallMethod;
