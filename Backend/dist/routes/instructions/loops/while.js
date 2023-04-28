"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const type_1 = require("../../types/type");
const symbolTable_1 = require("../../symbols/symbolTable");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class While extends instruction_1.Instruction {
    constructor(condition, body, line, column) {
        super(line, column);
        this.condition = condition;
        this.body = body;
    }
    run(globalST, localST, methods, environment) {
        var condition = this.condition.run(globalST, localST, methods, environment);
        this.setError(condition);
        while (condition.value) {
            var localST2 = new symbolTable_1.SymbolTable(localST.symbols);
            const control = this.runInstrucctions(globalST, localST2, methods, environment + '_while');
            //Sentencias de control
            if (control !== null) {
                if (control.type === type_1.ControlType.BREAK) {
                    break;
                }
                else if (control.type === type_1.ControlType.CONTINUE) {
                    condition = this.condition.run(globalST, localST, methods, environment);
                    continue;
                }
                else if (control.type === type_1.ControlType.RETURN) {
                    return control;
                }
            }
            condition = this.condition.run(globalST, localST, methods, environment);
            this.setError(condition);
        }
    }
    setError(condition) {
        if (condition.type != type_1.ValueType.BOOLEAN) {
            report_1.output.setOutput(`-->Semántico, condicion de if no es de tipo BOOLEAN (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Condicion de if no es de tipo BOOLEAN`, this.line, this.column);
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
        const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const condition = this.condition.getAST(methods);
        let ast = `${id} [label="While"];
        ${condition.ast}
        ${id} -> ${condition.id};
        ${aux} [label="Cuepo"];
        ${id} -> ${aux};\n`;
        for (var i in this.body) {
            const temp = this.body[i].getAST(methods);
            ast += `${temp.ast}
            ${aux} -> ${temp.id};\n`;
        }
        return { id: id, ast: ast };
    }
}
exports.While = While;
