"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const type_1 = require("../../types/type");
const symbolTable_1 = require("../../symbols/symbolTable");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class For extends instruction_1.Instruction {
    constructor(declaration, condition, update, body, line, column) {
        super(line, column);
        this.declaration = declaration;
        this.condition = condition;
        this.update = update;
        this.body = body;
    }
    run(globalST, localST, methods, environment) {
        var localST2 = new symbolTable_1.SymbolTable(localST.symbols);
        this.declaration.run(globalST, localST2, methods, environment + '_for');
        var condition = this.condition.run(globalST, localST2, methods, environment);
        this.setError(condition);
        while (condition.value) {
            var localST3 = new symbolTable_1.SymbolTable(localST2.symbols);
            const control = this.runInstrucctions(globalST, localST3, methods, environment + '_for');
            //Sentencias de control
            if (control !== null) {
                if (control.type === type_1.ControlType.BREAK) {
                    break;
                }
                else if (control.type === type_1.ControlType.CONTINUE) {
                    this.update.run(globalST, localST, methods, environment);
                    condition = this.condition.run(globalST, localST3, methods, environment);
                    continue;
                }
                else if (control.type === type_1.ControlType.RETURN) {
                    return control;
                }
            }
            this.update.run(globalST, localST3, methods, environment);
            condition = this.condition.run(globalST, localST3, methods, environment);
            this.setError(condition);
        }
    }
    setError(condition) {
        if (condition.type != type_1.ValueType.BOOLEAN) {
            report_1.output.setOutput(`-->Semántico, condicion no es de tipo BOOLEAN (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Condicion no es de tipo BOOLEAN.`, this.line, this.column);
        }
    }
    runInstrucctions(globalST, localST, methods, environment) {
        for (var i in this.body) {
            const control = this.body[i].run(globalST, localST, methods, environment);
            if (control !== null && control !== undefined) {
                return control;
            }
        }
        return null;
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const aux1 = this.getConditions(methods);
        const aux2 = this.getBody(methods);
        const ast = `${id} [label="For"];
        ${aux1.ast}
        ${id} -> ${aux1.id}
        ${aux2.ast}
        ${id} -> ${aux2.id}`;
        return { id: id, ast: ast };
    }
    getConditions(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const declaration = this.declaration.getAST(methods);
        const condition = this.condition.getAST(methods);
        const update = this.update.getAST(methods);
        const ast = `${id} [label="Condicion"];
        ${declaration.ast}
        ${id} -> ${declaration.id};
        ${condition.ast}
        ${id} -> ${condition.id};
        ${update.ast}
        ${id} -> ${update.id}; `;
        return { id: id, ast: ast };
    }
    getBody(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Cuerpo"]; `;
        for (var i in this.body) {
            const aux = this.body[i].getAST(methods);
            ast += `${aux.ast}
            ${id} -> ${aux.id}; `;
        }
        return { id: id, ast: ast };
    }
}
exports.For = For;
